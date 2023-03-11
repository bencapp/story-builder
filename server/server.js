const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

const sessionMiddleware = require("./modules/session-middleware");
const passport = require("./strategies/user.strategy");

// Route includes
const userRouter = require("./routes/user.router");
const inviteRouter = require("./routes/invite.router");

// SOCKET.IO INSTALLATION
const http = require("http");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use("/api/user", userRouter);
app.use("/api/invite", inviteRouter);

// SOCKET.IO SETUP
io.on("connection", (socket) => {
  console.log("a user connected");
  // user should join the room that is associated with their user.id

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", (msg) => {
    console.log("receiving chat message:", msg);
    io.emit("chat message", msg);
  });
  socket.on("private invite", (invitingUser) => {
    console.log(
      "receiving private invite from",
      invitingUser,
      "to"
      // invitedUser
    );
    io.emit("private invite", invitingUser);
  });
});

// Serve static files
app.use(express.static("build"));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
