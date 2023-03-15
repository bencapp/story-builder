const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

// POST endpoint for adding text elements
router.post("/", rejectUnauthenticated, (req, res) => {
  console.log("in post text");
  const queryText = `INSERT INTO text ("story_id", "user_id", "text", "timestamp")
                    VALUES ($1, $2, $3, current_timestamp)`;
  const queryParams = [req.body.story_id, req.body.user_id, req.body.text];
  pool
    .query(queryText, queryParams)
    .then(() => {
      req.io.to("test-room").emit("add text", req.body.text, req.body.user_id);
      res.sendStatus(204);
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

module.exports = router;
