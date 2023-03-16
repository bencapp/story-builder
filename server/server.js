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

const {
  rejectUnauthenticated,
} = require("./modules/authentication-middleware");
const pool = require("./modules/pool");

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
  socket.on("accept invite", (invite, currentStoryID) => {
    console.log(
      "sending two users to a room, invite is:",
      invite,
      "story id is:",
      currentStoryID
    );

    // join the socket room
    // room name can be based on story ID
    socket.join(`room-story-id-${currentStoryID}`);
    console.log("User", invite.recipient_user_id, "joined the test room");

    io.emit("accept invite", invite, currentStoryID);
  });

  // on room join: for user who sent the invite
  socket.on("join room", (storyID) => {
    console.log("In join room, joining room:", `room-story-id-${storyID}`);
    socket.join(`room-story-id-${storyID}`);
  });

  // variable storing whose turn it is
  // user1 is the first player on the client side, identified
  // by firstPlayerID

  socket.on("start clock", (user1ID, user2ID, storyID, firstPlayerID) => {
    const room = `room-story-id-${storyID}`;
    console.log("starting clock in room", room);

    // start interval only if the user is user1
    // otherwise, we will have two clocks going
    console.log(
      "about to start timer, user1ID is",
      user1ID,
      "firstPlayerID is",
      firstPlayerID
    );

    // create socket listener for both players
    socket.on("add text", (text, partnerUser, room) => {
      console.log("received add text:", text, partnerUser, room);
      // set turn toggle to the user who did NOT just add text
      const toggleTurnQueryText = `UPDATE story SET current_user_turn_id = $1 WHERE id = $2`;
      const toggleTurnQueryParams = [partnerUser.id, storyID];
      pool
        .query(toggleTurnQueryText, toggleTurnQueryParams)
        .then()
        .catch((error) => {
          console.log(
            "Failed to execute SQL query:",
            toggleTurnQueryText,
            " : ",
            error
          );
        });
    });

    console.log(
      "about to start interval, user1ID is",
      user1ID,
      "user2ID is",
      user2ID
    );

    if (user1ID == firstPlayerID) {
      // set initial turn toggle value
      const setInitialTurnQueryText = `UPDATE story SET current_user_turn_id = $1 WHERE id = $2`;
      const setInitialTurnQueryParams = [user1ID, storyID];
      pool
        .query(setInitialTurnQueryText, setInitialTurnQueryParams)
        .then(() => {
          // timer countdown functionality
          // declare starting time for each user. TODO: modulate
          // based on story parameters
          // 30,000 milliseconds = 30 seconds
          let user1Milliseconds = 10000;
          let user2Milliseconds = 10000;

          let myInterval = setInterval(() => {
            let userTurnID;
            // get current user turn
            const getUserTurnQueryText = `SELECT current_user_turn_id FROM story WHERE id = $1`;
            const getUserTurnQueryParams = [storyID];
            pool
              .query(getUserTurnQueryText, getUserTurnQueryParams)
              .then((result) => {
                userTurnID = result.rows[0].current_user_turn_id;
                console.log("got user turn, it is", userTurnID + "'s turn");
                // decrease time for the user whose turn it is
                console.log("in interval, it is", userTurnID + "'s turn");
                if (userTurnID == user1ID) {
                  if (user1Milliseconds > 0) {
                    user1Milliseconds -= 100;
                    io.to(room).emit("update time", user1ID, user1Milliseconds);
                  } else {
                    clearInterval(myInterval);
                  }
                }
                // if it is user2's turn
                else {
                  if (user2Milliseconds > 0) {
                    user2Milliseconds -= 100;
                    io.to(room).emit("update time", user2ID, user2Milliseconds);
                  } else {
                    clearInterval(myInterval);
                  }
                }
              })
              .catch((error) => {
                console.log(
                  "Failed to execute SQL query:",
                  getUserTurnQueryText,
                  " : ",
                  error
                );
              });
          }, 100);
        })
        .catch((error) => {
          console.log(
            "Failed to execute SQL query:",
            setInitialTurnQueryText,
            " : ",
            error
          );
        });
    }
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
