const http = require('http');
const Koa = require('koa');
const WS = require('ws');

const app = new Koa();

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
const wsServer = new WS.Server({ server });
const users = [];
const messages = [];

wsServer.on('connection', (ws, req) => {
  ws.on('message', (msg) => {
    const obj = JSON.parse(msg);
    switch (obj.type) {
      case 'userName':
        for (let i = 0; i < users.length; i += 1) {
          if (obj.name === users[i].data.name) {
            ws.close(1000, 'Это логин занят!');
            return;
          }
        }
        ws.data = obj;
        users.push(ws);
        array = [];
        users.forEach((el) => {
          array.push(el.data)
        });
        Array.from(wsServer.clients)
          .filter((el) => el.readyState === WS.OPEN)
          .forEach((el) => {
            el.send(
              JSON.stringify({
                type: 'general',
                users: array,
                messages: messages,
              })
            );
          });
        return;
      case 'message':
        messages.push(obj);
        Array.from(wsServer.clients)
          .filter((el) => el.readyState === WS.OPEN)
          .forEach((el) => {
            el.send(JSON.stringify(obj));
          });
        return;
    }
    ws.on('close', () => {
      const index = users.findIndex(
        (client) => client.data.name === ws.data.name
      );
      if (index !== -1) {
        users.splice(index, 1);
        users.forEach((el) => {
          array.push(el.data)
        });
        Array.from(wsServer.clients)
          .filter((el) => el.readyState === WS.OPEN)
          .forEach((el) => {
            el.send(
              JSON.stringify({
                type: 'general',
                users: array,
                messages: messages,
              })
            );
          });
          return;
      }
    });
  });
});

server.listen(port, () => console.log('server started'));
