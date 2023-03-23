const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT * FROM user_story_votes WHERE user_id = $1`;
  pool
    .query(queryText, [req.user.id])
    .then((result) => res.send(result.rows))
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

router.post("/:storyID", rejectUnauthenticated, (req, res) => {
  console.log("in vote POST, req.body is", req.body);
  const queryText = `INSERT INTO user_story_votes ("user_id", "story_id", "vote")
                    VALUES ($1, $2, $3)`;
  const queryParams = [req.user.id, req.params.storyID, req.body.vote];
  pool
    .query(queryText, queryParams)
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

router.put("/:storyID", rejectUnauthenticated, (req, res) => {
  const queryText = `UPDATE user_story_votes SET vote = $1 WHERE user_id = $2 AND story_id = $3`;
  const queryParams = [req.body.vote, req.user.id, req.params.storyID];
  pool
    .query(queryText, queryParams)
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

router.delete("/:storyID", rejectUnauthenticated, (req, res) => {
  const queryText = `DELETE FROM user_story_votes WHERE user_id = $1 AND story_id = $2`;
  const queryParams = [req.user.id, req.params.storyID];
  pool
    .query(queryText, queryParams)
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

module.exports = router;
