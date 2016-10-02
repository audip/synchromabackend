var express = require("express");
var bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.post('/api-server', function(req, res, next){
    const data = req.body.toLowerCase();

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
        case "nessie":  nessie();
                        break;
        case "alexa": nessie();
                      break;
    };


    // Post to corresponding function
    test_response = {
        "hey_word": hey_word,
        "cmd":cmd
    };
    res.set('Content-Type', 'text/plain');
    res.send(test_response);
});

function nessie(){
    console.log("Hi I am Nessie");
};

var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %s...", server.address().port);
});
