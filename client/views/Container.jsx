import React from 'react';

var Container = React.createClass({displayName: 'Container',
  render: function() {
    return React.createElement("h1", null, "container:");
  }
});


// const MyAwesomeReactComponent = React.createClass({
//   handleClick(e) {
//     console.log("e: ", e);
//     // send request to outside API to get news
//   },

//   render(){
//     return <RaisedButton
//       primary={true}
//       label="Read news"
//       onClick={this.handleClick}
//     />
//   }
// });

// ReactDOM.render(
//   <div>
//     <MuiThemeProvider>
//       <MyAwesomeReactComponent />
//     </MuiThemeProvider>
//     <MuiThemeProvider>
//       <Toggle
//         label='On-line'
//       />
//     </MuiThemeProvider>
//   </div>,
//   document.getElementById('world')
// );


module.exports = Container