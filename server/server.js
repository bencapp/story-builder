const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

const sessionMiddleware = require("./modules/session-middleware");
const passport = require("./strategies/user.strategy");

// Route includes
const userRouter = require("./routes/user.router");
const inviteRouter = require("./routes/invite.router");
const storyRouter = require("./routes/story.router");
const textRouter = require("./routes/text.router");

// SOCKET.IO INSTALLATION
const http = require("http");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origins: ["http://localhost:3000", "http://localhost:3001"],
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

// assign io object to the invite router. That way, we can call the
// socket functions within express endpoints.
// middleware
app.use((req, res, next) => {
  req.io = io;
  return next();
});

/* Routes */
app.use("/api/user", userRouter);
app.use("/api/invite", inviteRouter);
app.use("/api/story", storyRouter);
app.use("/api/text", textRouter);

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

  // socket.on("private invite", (invitingUser, invitedUser) => {
  //   console.log(
  //     "receiving private invite from",
  //     invitingUser,
  //     "to",
  //     invitedUser
  //   );
  //   io.emit("private invite", { invitingUser, invitedUser });
  // });

  // when an invite is accepted, create a new room
  socket.on("accept invite", (invite) => {
    console.log("server received accept invite, invite is", invite);
    console.log("sending two users to a room:", invite);
    //join the socket room, use the first user's id to define the room
    socket.join("test-room");
    console.log("User", invite.recipient_user_id, "joined the test room");

    // TODO: CREATE LOGIC TO GENERATE A NEW ROOM NAME WHENEVER THIS NEXT LINE TRIGGERS
    io.emit("accept invite", invite);
  });

  // on room join: for user who sent the invite
  socket.on("join room", (user) => {
    console.log("User", user.id, "joined the test room");
    socket.join("test-room");
  });

  socket.on("add text", (text, user, room) => {
    console.log("received add text:", text, user, room);
    io.to(room).emit("add text", text, user);
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
