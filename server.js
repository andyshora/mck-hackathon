var express = require('express');
var app = express();
var stackexchange = require('stackexchange');
var config = require('./config');

app.use(express.static(__dirname));

var options = { version: 2.2 };
var context = new stackexchange(options);

app.get('/api/questions/:tag', function(req, res) {
  var filter = {
    key: config.key,
    pagesize: 50,
    tagged: req.params.tag,
    sort: 'activity',
    order: 'asc'
  };

  // Get all the questions (http://api.stackexchange.com/docs/questions) 
  context.questions.questions(filter, function(err, results){
    if (err) {
      res.status(500).send(err);
      console.error(err);
    }

    if (results.has_more) {
      // recursively build results
      console.log('There\'s more...');
    }
    
    res.json(results.items);
  });

});

app.listen(process.env.PORT || 3000, function() { console.log('Listening on port ', process.env.PORT || 3000) });