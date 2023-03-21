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

  // on start story. user who created the invite tells the accepting user
  // that they are ready to start story
  socket.on("ready to start story", (invite, storyID) => {
    console.log("in ready to start story, invite is", invite);
    io.to(`room-story-id-${storyID}`).emit("ready to start story");
  });

  // when a story instance is created
  socket.on("start clock", (user1ID, user2ID, storyID) => {
    const room = `room-story-id-${storyID}`;
    console.log("starting clock in room", room);

    // create socket listener for both players
    socket.on("add text", (text, currentUser, partnerUser, room) => {
      console.log("received add text:", text, currentUser, room);
      console.log("in add text, partnerUser is", partnerUser);
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

    // get starting player ID from the database
    const getInitialTurnQueryText = `SELECT current_user_turn_id FROM story WHERE id = $1`;
    const getInitialTurnQueryParams = [storyID];
    pool
      .query(getInitialTurnQueryText, getInitialTurnQueryParams)
      .then((result) => {
        const startingPlayerID = result.rows[0].current_user_turn_id;
        console.log(
          "got starting player, startingPlayerID is",
          startingPlayerID
        );

        // start interval only if the user is user1
        // otherwise, we will have two clocks going
        if (user1ID == startingPlayerID) {
          // timer countdown functionality
          // declare starting time for each user. TODO: modulate
          // based on story parameters
          // 30,000 milliseconds = 30 seconds
          let user1Milliseconds = 5000;
          let user2Milliseconds = 5000;

          let myInterval = setInterval(() => {
            let userTurnID;
            // get current user turn
            const getUserTurnQueryText = `SELECT current_user_turn_id FROM story WHERE id = $1`;
            const getUserTurnQueryParams = [storyID];
            pool
              .query(getUserTurnQueryText, getUserTurnQueryParams)
              .then((result) => {
                userTurnID = result.rows[0].current_user_turn_id;

                console.log("counting, it is user", userTurnID + "'s turn");

                // decrease time for the user whose turn it is
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
              });
          }, 100);
        }
      })
      .catch((error) => {
        console.log(
          "Failed to execute SQL query:",
          getInitialTurnQueryText,
          " : ",
          error
        );
      });
  });

  // on submit story, tell the partner user and refresh the page
  // refresh is necessary to avoid current bugs
  socket.on("make story public", (storyID, senderUserID) => {
    io.to(`room-story-id-${storyID}`).emit("make story public", senderUserID);
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
