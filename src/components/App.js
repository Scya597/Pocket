import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import LoginBox from './LoginBox';

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
    return (
      <div>
        {this.state.login === 1
          ? <div id="pixi" />
          : <LoginBox handlelogin={this.handleLogin} socket={this.state.socket} />}
      </div>
    );
  }
}

export default App;
