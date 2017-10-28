import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

// import testData from '../testData/testData.json';
import '../scss/title.scss';

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: 'localhost:8080',
      userList: [],
    };

    const { endpoint } = this.state;
    this.state.socket = socketIOClient(endpoint);
  }

  componentWillMount(){
    this.state.socket.on('getUserList', (userList)=> {
      this.setState({userList});
    });
  }

  setTitle = () => {
    this.state.socket.emit('setName', { name: this.refs.text.value });
    this.refs.text.value = '';
    this.state.socket.on('getUserList', (userList)=> {
      this.setState({userList});
    });
  }

  render() {
    return (
      <div id="startMenuWrapper">
        <div id="startMenu">
          <p>Your Online Game</p>
          <input
            type="text"
            tabIndex="0"
            placeholder="Enter your name here"
            id="playerNameInput"
            ref="text"
          />
          <b className="input-error">Nick name must be alphanumeric characters only!</b>
          <br />
          <button id="startButton" onClick={this.setTitle}>Play</button>
          {this.state.userList.map((user)=>
            (<div className="userName"> {user.name} </div>)
          )}
        </div>
      </div>
    );
  }
}

export default App;
