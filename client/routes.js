import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute  } from 'react-router';

var Main = require('./views/Main.jsx');
var Stories = require('./views/Stories.jsx');
var Story = require('./views/Story.jsx');

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Stories} />
  </Router>
);

// var routes = (
//   <Router history={browserHistory}>
//     <Route path="/" component={Stories} />
//     <Route path="/stories" component={Stories} />
//     <Route path="/stories/:id" component={Story} />
//   </Router>
// );

module.exports = routes