const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

// POST endpoint for adding text elements
router.post("/", (req, res) => {
  console.log("in post text");
  const queryText = `INSERT INTO text ("story_id", "user_id", "text")
                    VALUES ($1, $2, $3)`;
  const queryParams = [req.body.storyID, req.body.userID, req.body.text];
});

module.exports = router;
