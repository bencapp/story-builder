const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

// POST STORY ENDPOINT
// req.body is
// {
//   story: {
//     title: invite.title,
//     speed_type: invite.speed_type,
//     text_type: invite.text_type,
//   },
//   invite: {
//     id,
//     sender_user_id,
//     recipient_user_id,
//     title
//     sender_user_username
//   }
// },
router.post("/", rejectUnauthenticated, async (req, res) => {
  // first, insert into the story table
  const storyQueryText = `INSERT INTO "story" ("title", "speed_type", "length_type")
    VALUES ($1, 'default', 'default')`;
  const storyQueryParams = [req.body.story.title];

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
    const user1ID = req.body.invite.sender_user_id;
    const user2ID = req.body.invite.recipient_user_id;
    await connection.query(userStoryQueryText, [user1ID, currentStoryID]);
    await connection.query(userStoryQueryText, [user2ID, currentStoryID]);

    // finally, choose a random player to go first
    const firstPlayerInt = Math.round(Math.random());
    const firstPlayerID = firstPlayerInt === 0 ? user1ID : user2ID;

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
  // OLD VERSION OF STORY POST USING .then()
  // pool
  //   .query(queryText, queryParams)
  //   .then((response) => {
  //     // then, select the id of the story just added
  //     const storyIDQueryText = `SELECT currval('story_id_seq')`;
  //     pool.query(storyIDQueryText).then((response) => {
  //       // choose either 0 or 1 at random
  //       const firstPlayerInt = Math.round(Math.random());
  //       console.log(
  //         "chose a random number for first player, int is",
  //         firstPlayerInt
  //       );
  //       const firstPlayer = firstPlayerInt === 0 ? "recipient" : "sender";
  //       res.send({
  //         currentStoryID: response.rows[0].currval,
  //         firstPlayer: firstPlayer,
  //       });
  //     });
  //   })
  //   .catch((error) => {
  //     console.log("Failed to execute SQL query:", queryText, " : ", error);
  //     res.sendStatus(500);
  //   });
});

module.exports = router;
