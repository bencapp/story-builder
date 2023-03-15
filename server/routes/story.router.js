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
      console.log("successfully posted into story table");
      res.sendStatus(204);
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

module.exports = router;
