import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import uuid from 'uuid/v1';
import LoginBox from './LoginBox';
import Pixi from './Pixi';


class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: 'localhost:8080',
      login: 0,
    };
    const { endpoint } = this.state;
    this.socket = socketIOClient(endpoint);
    this.uuid = uuid();
  }

  handleLogin = () => {
    this.setState({ login: 1 });
    this.socket.emit('createPlayer', { uuid: this.uuid });
  }

  render() {
    return (
      <div>
        {this.state.login === 1
          ? <Pixi socket={this.socket} uuid={this.uuid}/>
          : <LoginBox handlelogin={this.handleLogin} socket={this.socket} />}
      </div>
    );
  }
}

export default App;
