import React, { Component } from 'react';
import testData from '../testData/testData.json';
import '../scss/title.scss';

class App extends Component {
  constructor() {
    super();
    this.state = {
      numbers: [1, 2, 3],
    };
  }

  componentDidMount() {
    console.log(testData);
  }

  render() {
    return (
      <div className="title">
        Boilerplate by YU-AN CHAN
      </div>
    );
  }
}

export default App;
