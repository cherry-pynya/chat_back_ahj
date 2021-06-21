const http = require("http");
const Koa = require("koa");
const WS = require('ws');

const app = new Koa();

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
const wsServer = new WS.Server({server});

wsServer.on('connection', (ws, req) => {
  const errCallback = (err) => {
    ws.send('you connected')
    if (err) {
      console.log(err);
    }
  }

  ws.on('message', msg => {
    const obj = JSON.parse(msg);
    console.log(obj);
    ws.send('ты пидор', errCallback);
    });
  ws.send('welcome', errCallback);
});

server.listen(port, () => console.log("server started"));
