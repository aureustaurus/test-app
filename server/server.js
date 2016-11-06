var express = require('express');
var app = express();
var wrap = require('co-express');
var storyModel = require('./models/story.js');

var serviceUrl = 'https://hacker-news.firebaseio.com/v0/';

app.get('/', function (req, res) {
  res.send('Welcome');
});

app.get('/online/all', wrap(function* (req, res) {
  console.log('/online/all');
  res.header("Access-Control-Allow-Origin", "*");
  var result = yield storyModel.getStoriesFromService();
  res.send(result);
}));

app.get('/online/items/:id', wrap(function* (req, res) {
  console.log('/online/items/:id');
  res.header("Access-Control-Allow-Origin", "*");
  var itemId = req.params.id;
  var result = yield storyModel.getItemFromServiceById(itemId);
  res.send(result);
}));

app.get('/offline/all', wrap(function* (req, res) {
  console.log('/offline/all');
  res.header("Access-Control-Allow-Origin", "*");
  var result = yield storyModel.getStoriesFromDb();
  res.send(result);
}));

app.get('/offline/items/:id', wrap(function* (req, res) {
  console.log('/offline/items/:id');
  res.header("Access-Control-Allow-Origin", "*");
  var itemId = req.params.id;
  var result = yield storyModel.getItemFromDbById(itemId);
  res.send(result);
}));

app.listen(8081, function () {
  console.log('App listening on port 8081!');
});