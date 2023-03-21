const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

// GET ENDPOINT for getting all invitations sent to a specific user
router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT invite.id, invite.sender_user_id, invite.recipient_user_id, invite.title, invite.speed_type, invite.text_type,
                      "u".username AS sender_user_username , "u2".username AS recipient_user_username FROM invite 
                      JOIN "user" AS "u" ON "u".id = invite.sender_user_id
                      JOIN "user" AS "u2" ON "u2".id = invite.recipient_user_id
                      WHERE recipient_user_id = $1;`;
  // query params is the user id who is receiving the invitation (current user)
  const queryParams = [req.user.id];
  pool
    .query(queryText, queryParams)
    .then((response) => {
      console.log(
        "sending all invites to a user, response.rows is",
        response.rows
      );
      res.send(response.rows);
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

// GET endpoint for all invitations sent by a specific user
router.get("/pending", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT invite.id, invite.sender_user_id, invite.recipient_user_id, invite.title, invite.speed_type, invite.text_type,
                      "u".username AS sender_user_username , "u2".username AS recipient_user_username FROM invite 
                      JOIN "user" AS "u" ON "u".id = invite.sender_user_id
                      JOIN "user" AS "u2" ON "u2".id = invite.recipient_user_id
                      WHERE sender_user_id = $1;`;
  // query params is the user id who is receiving the invitation (current user)
  const queryParams = [req.user.id];
  pool
    .query(queryText, queryParams)
    .then((response) => {
      res.send(response.rows);
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

/**
 * POST route
 */
router.post("/", rejectUnauthenticated, (req, res) => {
  console.log("receiving POST, req.body is", req.body);
  const sender_user_id = req.user.id;
  const recipient_user_id = req.body.invitedUser.id;
  const story_title = req.body.storyTitle;
  const text_type = req.body.text_type;
  const speed_type = req.body.speed_type;
  // perform an insert into the invite table
  // using the story id
  const inviteQueryText = `INSERT INTO "invite" ("sender_user_id", "recipient_user_id", "title", "speed_type", "text_type")
                              VALUES ($1, $2, $3, $4, $5)`;
  const inviteQueryParams = [
    sender_user_id,
    recipient_user_id,
    story_title,
    speed_type,
    text_type,
  ];
  pool
    .query(inviteQueryText, inviteQueryParams)
    .then(() => {
      // then, get the id of the invite just added
      const inviteIDQueryText = `SELECT currval('invite_id_seq')`;
      pool.query(inviteIDQueryText).then((response) => {
        // finally, perform a socket emit
        // socket emit with that invite as an object
        const newInviteID = response.rows[0].currval;
        const inviteToSend = {
          id: newInviteID,
          sender_user_id: sender_user_id,
          recipient_user_id: recipient_user_id,
          story_title: story_title,
          speed_type: speed_type,
          text_type: text_type,
        };

        console.log("emitting invite, invite is", inviteToSend);
        req.io.emit("private invite", inviteToSend);
        res.sendStatus(204);
      });
    })
    .catch((error) => {
      console.log(
        "Failed to execute SQL query:",
        inviteQueryText,
        " : ",
        error
      );
      res.sendStatus(500);
    });
});

/**
 * DELETE route
 */
router.delete("/:id", rejectUnauthenticated, (req, res) => {
  console.log(
    "In invite DELETE, req.params.id is",
    req.params.id,
    "req.user.id is",
    req.user.id
  );
  const queryText = `DELETE FROM invite 
                      WHERE id = $1 AND sender_user_id = $2 
                      OR recipient_user_id = $2`;
  const queryParams = [req.params.id, req.user.id];
  pool
    .query(queryText, queryParams)
    .then(() => {
      req.io.emit("delete invite");
      res.sendStatus(204);
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

module.exports = router;
