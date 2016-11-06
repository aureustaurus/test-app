import React from 'react';
import { createStore } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';


import axios from 'axios';
var API_URL = 'http://localhost:8081/'; 

var fetchStories = function (message) {
  return {
    type: 'FETCH_STORIES',
    message: message,
    completed: false
  };
};

var defaultState = {
  stories: []
};
 
var storiesApp = function (state, action) {
  switch (action.type) {
    case 'FETCH_STORIES':
      var newState = Object.assign({}, state);
      newState.stories = action.message;
      return newState;
 
    default:
      return state;
  }
}
 
var store = createStore(storiesApp, defaultState);

var AddTodoForm = React.createClass({
  getInitialState: function() {
    return({ 
      stories: [],
      status: true
    });
  },

  onShowAllStories: function (e) {
    e.preventDefault();
    var url = API_URL + 'online/all';
    if (!this.state.status) {
      url = API_URL + 'offline/all';
    }
    axios.get(url)
    .then(response => {
      if (response.status == 200) {
        var stories = response.data;
        store.dispatch(fetchStories(stories));
        this.setState({ stories:  stories});
      }
    })
    .catch((error) => {
      console.log(error);
    })
  },

  onChangeStatus: function (e) {
    var value = e.target.value;
    var newStatus = Object.assign({}, this.state.status);
    newStatus = !this.state.status;
    this.setState({status: newStatus});
  },

  render: function() {
    var statusLabel = 'Off-line';
    if (this.state.status) {
      statusLabel = 'On-line';
    }
    return (
      React.createElement("div", null,
        <MuiThemeProvider>
          <Toggle
            label={statusLabel}
            onToggle={this.onChangeStatus}
            defaultToggled={this.state.status}
            style={{
              width: '120px',
              display: 'block'
            }}
          />
        </MuiThemeProvider>,
        <MuiThemeProvider>
          <RaisedButton
            primary={true}
            label="Show 10 latest stories"
            onClick={this.onShowAllStories}
          />
        </MuiThemeProvider>
        // React.createElement("input", {
        //   type: "button",
        //   value: 'Show 10  stories',
        //   onClick: this.onShowAllStories
        // })
      )
    );
  }
});

var StoryItem = React.createClass({
  render: function() {
    var story = JSON.stringify(this.props.story);
    story = story.toString();
    return(
      React.createElement("li", null,
        React.createElement("p", null, story
        )
      )
    );
  }
});

var StoriesList = React.createClass({
  getInitialState: function() {
    return({ 
      stories: []
    });
  },

  componentWillMount: function() {
    store.subscribe(() => {
      var state = store.getState();
      this.setState({
        stories: state.stories
      });
    });
  },

  render: function() {
    var stories = [];

    this.state.stories.forEach((item, index) => {
      stories.push(<StoryItem
        key={index}
        index={index}
        story={item}
      />);
    });

    if (!stories.length) {
      return (
        React.createElement("p", null,
          React.createElement("i", null, "No story.")
        )
      );
    }

    return (
      React.createElement("ol", null, stories)
    );
  }
});


var Stories = React.createClass({displayName: 'Stories',
  render: function() {
    return(
      React.createElement("div", null,
        React.createElement("h1", null, 'Last news:'),
        <AddTodoForm/>,
        <StoriesList/>
      )
    );
  }
});

module.exports = Stories