import React, { Component } from 'react';
import * as PIXI from 'pixi.js';
import _ from 'lodash';
import setting from './setting';

class Pixi extends Component {
  constructor(props) {
    super();
    this.state = {};
    this.socket = props.socket;
    this.uuid = props.uuid;
  }
  componentDidMount() {
    // setup basic config of pixi
    // create a pixi app
    this.app = new PIXI.Application(
      window.innerWidth, window.innerHeight,
      { antialias: true, backgroundColor: 0xe4e4e4, autoStart: true },
    );
    this.refs.pixi.appendChild(this.app.view);
    // set camera
    this.camera = new PIXI.Container();
    this.camera.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    this.camera.scale.set(1);
    this.app.stage.addChild(this.camera);
    // // set mousemove listener
    this.camera.interactive = true;
    // create border
    const border = new PIXI.Sprite(this.createBorder(setting.worldWidth, setting.worldHeight).generateCanvasTexture());
    this.camera.addChild(border);
    // animation loop
    this.app.ticker.add(() => {
      this.socket.emit('draw', (playerList) => {
        _.forEach(playerList, (val) => {
          const sprite = _.find(this.camera.children, { uuid: val.uuid });
          if (!sprite) {
            // already exist in camera
            sprite.x = val.x;
            sprite.y = val.y;
            if (this.uuid === val.uuid) {
              // my sprite
              this.camera.pivot.copy(sprite.position);
            }
          } else {
            // not exist in camera
            // create circle
            const circle = new PIXI.Sprite(this.createCircle(0x9ce5f4, val.x, val.y).generateCanvasTexture());
            circle.uuid = val.uuid;
            this.camera.addChild(circle);
            if (this.uuid === val.uuid) {
              // my sprite
              this.camera.on('mousemove', (e) => {
                const { x, y } = e.data.getLocalPosition(this.camera);
                const theta = Math.atan2(y - circle.y, x - circle.x);
                this.socket.emit('mouseMove', { uuid: this.uuid, theta });
                this.camera.pivot.copy(circle.position);
              });
            }
          }
        });
      });
    });
  }
  createBorder = (w, h) => {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, w, h);
    graphics.endFill();
    return graphics;
  }
  createCircle = (color, x, y, r) => {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle();
    graphics.beginFill(color);
    graphics.drawCircle(x, y, r);
    graphics.endFill();
    return graphics;
  }
  render() {
    return (
      <div className="pixi" ref="pixi" />
    );
  }
}

export default Pixi;
