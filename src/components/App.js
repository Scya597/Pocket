import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import uuid from 'uuid/v1';
import LoginBox from './loginBox';
import Pixi from './Pixi';


class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: 'localhost:8080',
      login: 0,
    };
    const { endpoint } = this.state;
    this.uuid = uuid();
    this.socket = socketIOClient(endpoint, { query: { uuid: this.uuid } });
  }

  handleLogin = () => {
    console.log('handle');
    this.setState({ login: 1 });
    this.socket.emit('createPlayer', this.uuid);
  }

  render() {
    return (
      <div>
        {this.state.login === 1
          ? <Pixi socket={this.socket} uuid={this.uuid} />
          : <LoginBox handlelogin={this.handleLogin} socket={this.socket} uuid={this.uuid} />}
      </div>
    );
  }
}

export default App;
