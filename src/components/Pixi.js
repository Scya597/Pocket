import React, { Component } from 'react';
import * as PIXI from 'pixi.js';
import _ from 'lodash';
import setting from '../setting';

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
    const border = new PIXI.Sprite(this.createBorder(setting.worldWidth, setting.worldHeight)
      .generateCanvasTexture());

    this.camera.addChild(border);
    // animation loop
    this.app.ticker.add(() => {
      this.socket.emit('updateServerPos');
      this.socket.on('updateClientPos', (playerList) => {
        _.forEach(playerList, (player) => {
          const sprite = _.find(this.camera.children, { uuid: player.uuid });
          if (!sprite) {
            // not exist in camera
            // create circle
            let circle;
            if (this.uuid === player.uuid) { // my sprite
              circle = new PIXI.Sprite(this.createCircle(0x3080e8, 0, 0, setting.circleRadius)
                .generateCanvasTexture());
            } else {
              circle = new PIXI.Sprite(this.createCircle(0x9ce5f4, 0, 0, setting.circleRadius)
                .generateCanvasTexture());
            }

            circle.anchor.set(0.5, 0.5);
            circle.uuid = player.uuid;
            circle.x = player.x;
            circle.y = player.y;

            this.camera.addChild(circle);
            if (this.uuid === player.uuid) {
              // my sprite
              this.camera.on('mousemove', (e) => {
                const { x, y } = e.data.getLocalPosition(this.camera);
                const theta = Math.atan2(y - circle.y, x - circle.x);
                this.socket.emit('mouseMove', this.uuid, theta);
                this.camera.pivot.copy(circle.position);
              });
            }
          } else {
            // already exist in camera
            sprite.x = player.x;
            sprite.y = player.y;
            if (this.uuid === player.uuid) {
              // my sprite
              this.camera.pivot.copy(sprite.position);
            }
          }
        });
      });
    });
    // delete player socket on
    this.socket.on('deletePlayer', (uuid) => {
      const sprite = _.find(this.camera.children, { uuid });
      this.camera.removeChild(sprite);
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
