import express from 'express';
import bodyParser from 'body-parser';
import _ from 'lodash';
import config from './config';
import setting from '../src/setting';

const path = require('path');
const http = require('http');

const app = express();


if (process.env.NODE_ENV === 'dev') {
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpack = require('webpack');
  const webpackDevConfig = require('../webpack.dev.config.js');
  const compiler = webpack(webpackDevConfig);
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackDevConfig.output.publicPath,
    stats: { colors: true },
  });
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
} else {
  app.use(express.static('public'));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
}

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
  next();
});

const server = http.createServer(app);
const io = require('socket.io')(server);

const userList = [];
const playerList = [];

// ##################
const startX = 100;
const startY = 100;

// ##################

io.on('connection', (socket) => {
  console.log(`New client ${socket.handshake.query.uuid} connected`);
  // login
  socket.emit('getUserList', userList);

  socket.on('setName', (name, uuid) => {
    userList.push({ name, uuid });
    io.emit('getUserList', userList);
  });
  // pixi
  socket.on('createPlayer', (uuid) => {
    playerList.push({ uuid, x: startX, y: startY });
  });
  socket.on('updateServerPos', () => {
    _.forEach(playerList, (player) => {
      if (!player.theta) return;
      if (player.x + setting.velocity * Math.cos(player.theta) - setting.circleRadius >= 0 &&
        player.x + setting.velocity * Math.cos(player.theta) + setting.circleRadius <= setting.worldWidth) { player.x += setting.velocity * Math.cos(player.theta); }
      if (player.y + setting.velocity * Math.sin(player.theta) - setting.circleRadius >= 0 &&
        player.y + setting.velocity * Math.sin(player.theta) + setting.circleRadius <= setting.worldHeight) { player.y += setting.velocity * Math.sin(player.theta); }
    });
    socket.emit('updateClientPos', playerList);
  });

  socket.on('mouseMove', (uuid, theta) => {
    const player = _.find(playerList, { uuid });
    if (player) {
      player.theta = theta;
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client ${socket.handshake.query.uuid} disconnected`);
    _.remove(userList, user => user.uuid === socket.handshake.query.uuid);
    _.remove(playerList, player => player.uuid === socket.handshake.query.uuid);
    io.emit('getUserList', userList);
    io.emit('deletePlayer', socket.handshake.query.uuid);
  });
});

server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
  console.log(process.env.NODE_ENV);
});
