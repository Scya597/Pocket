import express from 'express';
import bodyParser from 'body-parser';

import config from './config';

const path = require('path');
const http = require('http');

const app = express();

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
  next();
});

const server = http.createServer(app);
const io = require('socket.io')(server);

const obj = { hello: 'world' };
const userList = [];

io.on('connection', (socket) => {
  console.log('New client connected');
  io.emit('getUserList', userList);
  socket.emit('news', obj);
  socket.on('setName', (name) => {
    userList.push(name);
    io.emit('getUserList', userList);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
  console.log(process.env.NODE_ENV);
});
