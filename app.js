import React from 'react';
import ReactDOM from 'react-dom';

var routes = require('./client/routes.js');
// var Header = require('./client/views/Header.jsx');

//ReactDOM.render(<Header/>, document.getElementById('header'));
ReactDOM.render(routes, document.getElementById('container'));