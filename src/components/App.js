import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import loginBox from './loginBox';

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: 'localhost:8080',
      login: 0,
    };
    const { endpoint } = this.state;
    this.state.socket = socketIOClient(endpoint);
  }

  handleLogin = () => {
    this.setState({ login: 1 });
  }

  render() {
    let jsx;
    if (this.state.login === 0) {
      jsx = (
        <loginBox handleLogin={this.handleLogin} socket={this.state.socket} />
      );
    } else {
      jsx = (
        <div id="pixi" />
      );
    }

    return jsx;
  }
}

export default App;

