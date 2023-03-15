const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

// GET ENDPOINT for getting all invitations sent to a specific user
router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT invite.id, invite.sender_user_id, invite.recipient_user_id, invite.story_id, 
                    "user".username AS sender_user_username FROM invite 
                    JOIN "user" on "user".id = invite.sender_user_id
                    WHERE recipient_user_id = $1;`;
  // query params is the user id who is receiving the invitation (current user)
  const queryParams = [req.user.id];
  pool
    .query(queryText, queryParams)
    .then((response) => {
      console.log("got invites, response.rows is", response.rows);
      // now make another GET request to make sure that we send the recipient user name too
      const queryJoinText = res.send(response.rows);
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

// GET endpoint for all invitations sent by a specific user
router.get("/pending", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT invite.id, invite.sender_user_id, invite.recipient_user_id, invite.story_id, 
                      "user".username AS recipient_user_username FROM invite 
                      JOIN "user" on "user".id = invite.recipient_user_id
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
  // first, insert into the story table
  const storyQueryText = `INSERT INTO "story" ("title", "speed_type", "length_type")
  VALUES ($1, 'default', 'default')`;
  const storyQueryParams = [req.body.storyTitle];

  pool
    .query(storyQueryText, storyQueryParams)
    .then(() => {
      // then, get the id of the story that was just added
      const idQueryText = "SELECT currval('story_id_seq');";
      pool.query(idQueryText).then((response) => {
        const sender_user_id = req.user.id;
        const recipient_user_id = req.body.invitedUser.id;
        const storyID = response.rows[0].currval;
        // then, perform an insert into the invite table as well
        // using the story id
        const inviteQueryText = `INSERT INTO "invite" ("sender_user_id", "recipient_user_id", "story_id")
                              VALUES ($1, $2, $3)`;
        const inviteQueryParams = [sender_user_id, recipient_user_id, storyID];
        pool.query(inviteQueryText, inviteQueryParams).then(() => {
          // then, get the id of the invite just added
          const inviteIDQueryText = `SELECT currval('invite_id_seq')`;
          pool.query(inviteIDQueryText).then((response) => {
            // finally, perform a socket emit
            // socket emit with that invite as an object
            console.log(
              "got the invite just added: invite is",
              response.rows[0].currval
            );
            const newInviteID = response.rows[0].currval;
            const inviteToSend = {
              id: newInviteID,
              sender_user_id: sender_user_id,
              recipient_user_id: recipient_user_id,
              story_id: storyID,
            };
            console.log("emitting invite, invite is", inviteToSend);
            req.io.emit("private invite", inviteToSend);
            res.sendStatus(204);
          });
        });
      });
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
  // POST route code here
});

/**
 * DELETE route
 */
router.delete("/:id", rejectUnauthenticated, (req, res) => {
  console.log(
    "in server DELETE, req.user.id is",
    req.user.id,
    "req.params is",
    req.params
  );
  const queryText = `DELETE FROM invite WHERE id = $1 AND recipient_user_id = $2`;
  const queryParams = [req.params.id, req.user.id];
  pool
    .query(queryText, queryParams)
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

module.exports = router;
