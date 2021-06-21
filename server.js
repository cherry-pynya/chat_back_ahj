const http = require("http");
const Koa = require("koa");
const WS = require('ws');

const app = new Koa();

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
const wsServer = new WS.Server({server});
const users = []
const messages = [{
  type: 'message',
  text: '2',
  messageId: 'bdc51352-5d3f-4c3b-9942-ff4e81e400fb',
  time: '06/21/2021 11:35 PM',
  userId: '2bf373a0-a0e1-4221-8574-a83225d65421',
  messager: 'Никита Черепня'
}]

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
    switch(obj.type) {
      case 'userName':
        users.push(obj);
        Array.from(wsServer.clients)
          .filter(el => el.readyState === WS.OPEN)
          .forEach(el => {
            ws.send(JSON.stringify({
              type: 'general',
              users: users,
              messages: messages,
            }));
          });
        return;
      case 'message':
        messages.push(obj);
        Array.from(wsServer.clients)
          .filter(el => el.readyState === WS.OPEN)
          .forEach(el => {
            ws.send(JSON.stringify(obj))
          });
        return;
    }
    //ws.send('ты пидор', errCallback);
    });
  //ws.send('welcome', errCallback);
});

server.listen(port, () => console.log("server started"));
