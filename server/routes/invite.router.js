const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT "user".username, "user".id AS user_id, invite.id AS invite_id FROM invite 
                    JOIN "user" ON sender_user_id = "user".id 
                    WHERE recipient_user_id = $1;;`;
  // query params is the user id who is receiving the invitation (current user)
  const queryParams = [req.user.id];
  pool
    .query(queryText, queryParams)
    .then((response) => res.send(response.rows))
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

/**
 * POST route template
 */
router.post("/", rejectUnauthenticated, (req, res) => {
  const queryText = `INSERT INTO "invite" ("sender_user_id", "recipient_user_id")
                    VALUES ($1, $2)`;
  const queryParams = [req.user.id, req.body.id];
  pool
    .query(queryText, queryParams)
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
  // POST route code here
});

/**
 * DELETE route template
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
  // POST route code here
});

module.exports = router;
