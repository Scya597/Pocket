import React, { Component } from 'react';

class LoginBox extends Component {
  constructor(props) {
    super();
    this.state = {
      userList: [],
    };
    this.socket = props.socket;
    this.uuid = props.uuid;
  }

  componentWillMount() {
    this.socket.on('getUserList', (userList) => {
      this.setState({ userList });
    });
  }

  setTitle = () => {
    this.socket.emit('setName', this.refs.text.value, this.uuid);
    this.props.handlelogin(); // update app state
    this.refs.text.value = '';
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
          {this.state.userList.map(user =>
          (<div className="userName"> {user.name} </div>))}
        </div>
      </div>
    );
  }
}

export default LoginBox;
