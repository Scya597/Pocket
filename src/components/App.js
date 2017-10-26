import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

// import testData from '../testData/testData.json';
import '../scss/title.scss';

class App extends Component {
  constructor() {
    super();
    this.state = {
      // name: '',
      endpoint: 'localhost:8080',
    };
  }

  componentDidMount() {
    // console.log(testData);
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('news', (data) => {
      console.log(data);
    });
  }

  // setTitle() {
  //   const { endpoint } = this.state;
  //   const socket = socketIOClient(endpoint);
  //   socket.emit('setName', this.state.name);
  //   this.setState({ name: '' });
  // }
  //
  // handleName(event) {
  //   this.setState({ name: event.target.value });
  // }

  render() {
    return (
      <div className="title">
        huu
      </div>
    );
  }
}


// <div id="startMenuWrapper">
//   <div id="startMenu">
//     <p>Your Online Game</p>
//     <input
//       type="text"
//       tabIndex="0"
//       placeholder="Enter your name here"
//       id="playerNameInput"
//       value={this.state.name}
//       onChange={this.handleName}
//     />
//     <b className="input-error">Nick name must be alphanumeric characters only!</b>
//     <br />
//     <button id="startButton" onClick={this.setTitle()}>Play</button>
//   </div>
// </div>

export default App;