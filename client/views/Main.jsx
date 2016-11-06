import React from 'react';

var Container = React.createClass({displayName: 'Container',
  render: function() {
    return React.createElement("h1", null, "Main:");
  }
});

module.exports = Container