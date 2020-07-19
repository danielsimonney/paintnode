require("dotenv").config();
const express = require("express"),
  bodyParser = require("body-parser"),
  session = require("express-session"),
  home = require("./routes/paint");
film = require("./routes/film");
users = require("./routes/users");
authorizationMiddleware = require("./middlewares/auth");
const cors = require("cors");

const { sequelize, Paintspace } = require("./database");

const app = express(),
  server = require("http").createServer(app);
app.use(cors());
app.use(
  session({
    secret: "aziheoaiheoanoadoaq azdak",
    cookie: {},
    resave: true,
    saveUninitialized: true
  })
);

app.use(authorizationMiddleware);

var io = require("socket.io")(server);

io.on("connection", socket => {
  const filmId = socket.handshake.query.filmId;
  const distributorId = socket.handshake.query.distributorId;
  if (filmId) {
    socket.join(filmId);
  }
  if (distributorId) {
    socket.join(distributorId);
  }

  socket.on("updateDistributor", data => {
    io.in(distributorId).emit("updateCurrentDistributor", data);
  });
  socket.on("updateFilm", data => {
    io.in(filmId).emit("updateCurrentFilm", data);
  });
  socket.on("updateDiffusion", data => {
    io.emit("updateFilmDiffused", data);
  });

  socket.on("deletedistributor", data => {
    io.in(distributorId).emit("deletedistributor");
  });

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
app.use(users);
server.listen(3000);
