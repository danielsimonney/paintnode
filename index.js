const express = require("express"),
  bodyParser = require("body-parser"),
  session = require("express-session"),
  home = require("./routes/paint");
film = require("./routes/film");

const { sequelize, Paintspace } = require("./database");

const app = express(),
  server = require("http").createServer(app);

app.use(
  session({
    secret: "aziheoaiheoanoadoaq azdak",
    cookie: {},
    resave: true,
    saveUninitialized: true
  })
);

app.use((request, response, next) => {
  if (request.session.padAuth) {
  } else {
    request.session.padAuth = [];
  }
  next();
});

var io = require("socket.io")(server);

io.on("connection", socket => {
  const roomId = socket.handshake.query.padId;
  socket.join(roomId);
  socket.on("updatepad", (position, color) => {
    Paintspace.findByPk(roomId)
      .then(paint => {
        let newdata = JSON.parse(paint.data);
        newdata[position] = color;
        paint
          .update({
            data: JSON.stringify(newdata)
          })
          .then(paint => {
            io.in(roomId).emit("getData", position, color);
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  });
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(home);
app.use(film);
server.listen(3000);
