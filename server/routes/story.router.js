const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

// POST STORY ENDPOINT
// req.body is
// {
//     id,
//     sender_user_id,
//     recipient_user_id,
//     title
//     sender_user_username
// }

router.post("/", rejectUnauthenticated, async (req, res) => {
  console.log("in story post, req.body is", req.body);
  // choose a random player to go first
  const user1ID = req.body.sender_user_id;
  const user2ID = req.body.recipient_user_id;

  const firstPlayerInt = Math.round(Math.random());
  const firstPlayerID = firstPlayerInt === 0 ? user1ID : user2ID;

  // first, insert into the story table
  const storyQueryText = `INSERT INTO "story" ("title", "speed_type", "length_type", "current_user_turn_id")
    VALUES ('default', $1, $2, $3)`;
  const storyQueryParams = [
    req.body.speed_type,
    req.body.text_type,
    firstPlayerID,
  ];

  console.log("Posting story");

  const connection = await pool.connect();

  try {
    // insert story into the story table
    await connection.query(storyQueryText, storyQueryParams);

    // select the id of the story just added
    // and assign that id to a constant
    const storyIDQueryText = `SELECT currval('story_id_seq')`;
    const result = await connection.query(storyIDQueryText);
    const currentStoryID = result.rows[0].currval;

    // insert both users into user_story table to
    // define the relationship
    const userStoryQueryText = `INSERT INTO "user_story" ("user_id", "story_id")
                                VALUES ($1, $2)`;
    await connection.query(userStoryQueryText, [user1ID, currentStoryID]);
    await connection.query(userStoryQueryText, [user2ID, currentStoryID]);

    res.send({
      currentStoryID,
      firstPlayerID,
    });
  } catch (error) {
    await connection.query("FAILED STORY POST");
    console.log(`Error in story POST: `, error);
    res.sendStatus(500);
  } finally {
    connection.release();
  }
});

// GET endpoint for checking whose turn it is in a story
router.get("/turn/:storyID", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT current_user_turn_id FROM story WHERE id = $1`;
  const queryParams = [req.params.storyID];
  pool
    .query(queryText, queryParams)
    .then((result) => res.send(result.rows))
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

// PUT endpoint for making a story public
router.put("/public/:storyID", rejectUnauthenticated, (req, res) => {
  const queryText = `UPDATE story SET public = true WHERE id = $1`;
  const queryParams = [req.params.storyID];
  pool
    .query(queryText, queryParams)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

// GET endpoint for ALL STORIES
// anyone can access this endpoint without needing to log in
router.get("/", (req, res) => {
  const queryText = `SELECT story.id, story.title, story.speed_type, story.length_type, 
                      JSON_AGG(json_build_object('text', "text".text, 'timestamp', "text".timestamp, 'user_id', "text".user_id, 'username', "user".username)) AS texts FROM story
                      JOIN "text" ON story.id = "text".story_id
                      JOIN "user" ON "text".user_id = "user".id
                      WHERE story.public = true
                      GROUP BY story.id;`;
  pool
    .query(queryText)
    .then((result) => res.send(result.rows))
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

// GET endpoint for accessing a single story by its id
// anyone can access this endpoint without needing to log in
router.get("/story/:id", (req, res) => {
  const queryText = `SELECT story.id, story.title, story.speed_type, story.length_type, story.start_time,
                      JSON_AGG(json_build_object('text', "text".text, 'timestamp', "text".timestamp, 'user_id', "text".user_id, 'username', "user".username)) 
                      AS texts FROM story
                      JOIN "text" ON story.id = "text".story_id
                      JOIN "user" ON "text".user_id = "user".id
                      WHERE story.public = true AND story.id = $1
                      GROUP BY story.id;`;
  const queryParams = [req.params.id];
  pool
    .query(queryText, queryParams)
    .then((result) => res.send(result.rows))
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

// GET endpoint for all stories that a specific user contributed to
// does not need to reject unauthenticated – ideally other users should be able to see stories that
// specific users contributed to
router.get("/user-story/:userID", (req, res) => {
  const queryText = `SELECT story.id, story.title, story.speed_type, story.length_type, 
                      JSON_AGG(json_build_object('text', "text".text, 'timestamp', "text".timestamp, 'user_id', "text".user_id, 'username', "user".username)) AS texts FROM story
                      JOIN "text" ON story.id = "text".story_id
                      JOIN "user" ON "text".user_id = "user".id
                      WHERE story.public = true
                      GROUP BY story.id;`;
  pool
    .query(queryText)
    .then((result) => {
      // filter stories by userID
      const userID = req.params.userID;
      const stories = result.rows;

      const storiesByUser = stories.filter(
        (story) =>
          story.texts[0].user_id == userID || story.texts[1].user_id == userID
      );

      res.send(storiesByUser);
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

// PUT endpoint for setting the start time of a story
router.put("/start-time/:storyID", rejectUnauthenticated, (req, res) => {
  const queryText = `UPDATE story SET start_time = current_timestamp WHERE id = $1`;
  const queryParams = [req.params.storyID];
  pool
    .query(queryText, queryParams)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

// DELETE endpoint for removing a story that was just written
router.delete("/:storyID", rejectUnauthenticated, (req, res) => {
  console.log(
    "in story delete, req.params.storyID is",
    req.params.storyID,
    "req.user.id is",
    req.user.id
  );
  // only the user whose turn it is should be able to delete the story
  const queryText = `DELETE FROM story 
                      USING user_story WHERE story.id = user_story.story_id AND
                      story.id = $1 AND user_story.user_id = $2;`;
  const queryParams = [req.params.storyID, req.user.id];
  pool
    .query(queryText, queryParams)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

// PUT endpoint for setting the title of a story
router.put("/title/:storyID", rejectUnauthenticated, (req, res) => {
  console.log(
    "in story put, req.params.storyID is",
    req.params.storyID,
    "req.body is",
    req.body
  );
  const queryText = `UPDATE story SET title = $1 
                      FROM user_story WHERE story.id = user_story.story_id 
                      AND story.id = $2
                      AND user_story.user_id = $3`;
  const queryParams = [req.body.title, req.params.storyID, req.user.id];
  pool
    .query(queryText, queryParams)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

router.get("/types/:storyID", (req, res) => {
  const queryText = `SELECT speed_type, length_type FROM story WHERE id = $1`;
  const queryParams = [req.params.storyID];
  pool
    .query(queryText, queryParams)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("Failed to execute SQL query:", queryText, " : ", error);
      res.sendStatus(500);
    });
});

module.exports = router;
