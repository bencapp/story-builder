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
      // then, select the id of the story just added
      const storyIDQueryText = `SELECT currval('story_id_seq')`;
      pool.query(storyIDQueryText).then((response) => {
        // choose either 0 or 1 at random
        const firstPlayerInt = Math.round(Math.random());
        console.log(
          "chose a random number for first player, int is",
          firstPlayerInt
        );
        const firstPlayer = firstPlayerInt === 0 ? "recipient" : "sender";
        res.send({
          currentStoryID: response.rows[0].currval,
          firstPlayer: firstPlayer,
        });
      });
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

module.exports = router;
