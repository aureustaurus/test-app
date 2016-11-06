import React from 'react';
 
var Story = React.createClass({displayName: 'Story',
  render: function() {
    return React.createElement("h1", null, "Story");
  }
});

module.exports = Story