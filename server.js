const express = require('express'); // importing a CommonJS module
const helmet =require('helmet')
const morgan =require('morgan')
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();
function dateLogger(req, res, next) {
  console.log(new Date().toISOString());
  next();
}

function callHttp (req, res, next){
  console.log(`${req.method} to ${req.url}`)
  next();
}

function gateKeeper(req, res, next) {
  // data can come in the body, url parameters, query string, headers
  // new way of reading data sent by the client
  const password = req.headers.password || '';
  if (password == '')  {
    res.status(400).json({ you: 'please provide a password' });
  }
  else if (password.toLowerCase() === 'mellon') {
    next();
  } else {
    res.status(400).json({ you: 'cannot pass!!' });
  }

}


//globalmiddleware
server.use(helmet());
server.use(express.json());
server.use(gateKeeper);
server.use(dateLogger);
server.use(callHttp);
server.use(morgan('dev'))
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
