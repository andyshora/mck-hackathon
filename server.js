var express = require('express');
var app = express();
var stackexchange = require('stackexchange');
var config = require('./config');

app.use(express.static(__dirname));

var options = { version: 2.2 };
var context = new stackexchange(options);

function getRequestFilters(tag, page) {
  return {
    key: config.key,
    pagesize: 100,
    page: 1,
    tagged: tag,
    sort: 'activity',
    order: 'asc'
  };
}

app.get('/api/questions/:tag', function(req, res) {

  var filter = getRequestFilters(req.params.tag, 1);

  // Get all the questions (http://api.stackexchange.com/docs/questions) 
  context.questions.questions(filter, function(err, results) {
    if (err) {
      res.status(500).send(err);
      console.error(err);
    }

    if (results.has_more) {
      // recursively build results before returning
      // send another request with a 'page' parameter 1 more than last time
      console.log('There\'s more...');
    }
    
    res.json(results.items);
  });

});

app.listen(process.env.PORT || 3000, function() { console.log('Listening on port ', process.env.PORT || 3000) });