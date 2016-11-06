import React from 'react';

var Comment = React.createClass({displayName: 'Comment',
  render: function() {
    return React.createElement("h1", null, "one comment");
  }
});

module.exports = Comment