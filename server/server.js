import express from 'express';
import bodyParser from 'body-parser';

import config from './config';

const path = require('path');

const server = express();

server.use(express.static('public'));
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

server.use(bodyParser.json());

server.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
  next();
});

server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
  console.log(process.env.NODE_ENV);
});
