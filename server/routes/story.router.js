const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

// POST request for creating a new story
// this POST occurs before the title
router.post("/", rejectUnauthenticated, (req, res) => {
  const queryText = `INSERT INTO "story" ("title", "speed_type", "length_type")
                      VALUES ($1, 'default', 'default')`;
  const queryParams = [req.body.title];
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
});

module.exports = router;
