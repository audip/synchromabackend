var express = require("express");
var bodyParser = require("body-parser");

app = express();
app.use(bodyParser.text());

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

var appRouter = function(app) {
	app.post('/api-server', function(req, res, next){
		var data = req.body;

		if(!(req.body)){
			handleError(res, "Invalid user input received", "Must provide a string with (hey_word, command)");
		}
		// Parse string into (hey_word, cmd)
        console.log(data);
        // Find api corresponding to cmd
		// Post to corresponding function
		test_response = {
			//"hey_word": hey_word,
			//"cmd":cmd
		}
		res.status(200).json(test_response);
	});

}
module.exports = appRouter;
