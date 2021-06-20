const http = require("http");
const Koa = require("koa");
const Router = require("@koa/router");
const koaBody = require("koa-body");
const cors = require("@koa/cors");
const Tickets = require("./tickets");

const app = new Koa();
const tickets = new Tickets([]);
tickets.createTicket({
  header: "Say Hello!",
  text: "to my little friend",
});

app.use(
  cors({
    origin: "*",
    credentials: true,
    "Access-Control-Allow-Origin": true,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(koaBody({ json: true, text: true, urlencoded: true }));

const router = new Router();

router.get("/tickets", async (ctx) => {
  ctx.response.status = 204;
});



app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log("server started"));
