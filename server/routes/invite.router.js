const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

// GET ENDPOINT for getting all invitations sent to a specific user
router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT "user".username, "user".id AS user_id, invite.id AS invite_id FROM invite 
                    JOIN "user" ON sender_user_id = "user".id 
                    WHERE recipient_user_id = $1;`;
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

// GET endpoint for all invitations sent by a specific user
router.get("/pending", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT "user".username, "user".id AS user_id, invite.id AS invite_id FROM invite 
                    JOIN "user" ON recipient_user_id = "user".id 
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
  const invitingUserID = req.user.id;
  const invitedUserID = req.body.id;
  const queryText = `INSERT INTO "invite" ("sender_user_id", "recipient_user_id")
                    VALUES ($1, $2)`;
  const queryParams = [invitingUserID, invitedUserID];
  pool
    .query(queryText, queryParams)
    .then(() => {
      // then, perform an insert into the story table as well
      const storyQueryText = `INSERT INTO "story" ("title", "speed_type", "length_type")
                      VALUES ($1, 'default', 'default')`;
      const storyQueryParams = [req.body.title];
      pool
        .query(queryText, queryParams)
        .then(() => {
          // get the id of the story that was just inserted
          res.sendStatus(204);
        })
        .catch((error) => {
          console.log("Failed to execute SQL query:", queryText, " : ", error);
          res.sendStatus(500);
        });

      // also emit an invitation via SOCKET so that listening clients will
      // perform a GET request and retrieve the new data
      req.io.emit("private invite", { invitingUserID, invitedUserID });

      res.sendStatus(204);
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
