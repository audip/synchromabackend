var express = require("express");
var bodyParser = require("body-parser");
var request = require('superagent');
var firebase = require("firebase");

// Config for express
const app = express();

// Config for firebase
var config = {
  apiKey: "AIzaSyCr0XK0q61g6Xs22lKKIxPANevyFrHcuuc",
  databaseURL: "https://synchroma-ea381.firebaseio.com"
};
firebase.initializeApp(config);

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = firebase.database();
var ref = db.ref("/user-transactions");

// Config for body-parser
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.post('/api-server', function(req, res, next){
    const data = req.body.toLowerCase();

    // Check for error
    if(!(req.body)){
        handleError(res, "Invalid user input received", "Must provide a string with (hey_word, command)");
    }

    // Parse string into (hey_word, cmd)
    var hey_word = data.substr(0, data.indexOf(" "));
    var cmd = data.substr(data.indexOf(" ")+1);

    // List of API to connect with
    const apis = ["alexa", "nessie", "google"];

    // Return error when api functionality not found
    if (!(apis.includes(hey_word))) {
        handleError(res, "Sorry, we are yet to build that functionality");
    }

    // Find api corresponding to cmd
    switch(hey_word) {
        case "nessie":  //nessie(req, res);
        const apiKey = '23e0ca12ab71026c1cba2ce4ecd6031d';
        const customers = ['57f09ee9267ebde464c48a38', '57f0a40d267ebde464c48a47'];
        const accounts = ['57f0c26d267ebde464c48a52', '57f0c28a267ebde464c48a57'];

        var cmd_word = cmd.substr(0, cmd.indexOf(" "));
        var action = cmd.substr(cmd.indexOf(" ")+1);

        var txnRef;

        // When splitting the bill
        if (cmd_word == "split"){
            txnRef = ref.child("transaction");
            txnRef.set({
                amount: 50,
                active_users: 1,
                timestamp: Date.now()
            });
            res.set('Content-Type', 'text/json');
            res.send({data:"Ready to connect devices"});
        }
        else if (cmd_word == "pay" || cmd_word == "connect") {
            txnRef = ref.child("transaction/active_users");
            txnRef.transaction(function (current_value) {
                return (current_value || 0) + 1;
            });
        }
        var process_ready = false

        // Finish the transaction when 10 sec pass by.
        ref.on("child_changed", function(snapshot) {
            var last_update = snapshot.val().transaction;
            if ((Date.now() - last_update.timestamp) >= 10) {
                request
                    .post('http://api.reimaginebanking.com/accounts/'+accounts[0]+'/transfers?key='+apiKey)
                    .send({
                        "medium": "balance",
                        "payee_id": accounts[1],
                        "amount": 0.10
                    })
                    .end(function(err, result){
                        if (err) {
                            console.log(err);
                        } else {
                            res.set('Content-Type', 'text/json');
                            res.send({data:"Amount shared between your friends."});
                            console.log("Transfer completed between users.");
                        }
                    });
            }
        });
                        break;
    };


    // Post to corresponding function
    //test_response = {
    //    "hey_word": hey_word,
    //    "cmd":cmd
    //};
    //res.set('Content-Type', 'text/plain');
    //res.send(test_response);
});

function alexa(){
    console.log("Nice to hear from you");
};

var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %s...", server.address().port);
});
