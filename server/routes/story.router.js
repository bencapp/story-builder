const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

router.post("/", rejectUnauthenticated, (req, res) => {
  // first, insert into the story table
  const queryText = `INSERT INTO "story" ("title", "speed_type", "length_type")
    VALUES ($1, 'default', 'default')`;
  const queryParams = [req.body.title];
  pool
    .query(queryText, queryParams)
    .then((response) => {
      // then, send the id of the story just added back to the client
      const storyIDQueryText = `SELECT currval('story_id_seq')`;
      pool
        .query(storyIDQueryText)
        .then((response) => res.send(response.rows[0].currval));
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

module.exports = router;
