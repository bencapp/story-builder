import { Box } from "@mui/system";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@emotion/react";

function UpvoteDownvote({ story, userVote }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const currentUser = useSelector((store) => store.user);

  useEffect(() => {});

  const handleUpvote = () => {
    // update story votes based on vote
    // if user has already upvoted, do nothing
    console.log("about to upvote, current userVote is", userVote);
    // if there is no vote yet for the current user, add a vote row to the user_story_votes table
    if (!userVote) {
      dispatch({
        type: "ADD_USER_VOTE",
        payload: { storyID: story.id, vote: 1 },
      });
    } else {
      // if there is a vote and it is not already 1, change the vote to 1
      if (userVote != 1) {
        dispatch({
          type: "SET_USER_VOTE",
          payload: { storyID: story.id, vote: 1 },
        });
      } else {
        // if there is a vote and it is already 1, remove the vote row from the user_story_votes table
        dispatch({ type: "DELETE_USER_VOTE", payload: story.id });
      }
    }
  };

  const handleDownvote = () => {
    console.log("about to downvote, current userVote is", userVote);

    // if there is no vote yet for the current user, add a vote row to the user_story_votes table
    if (!userVote) {
      dispatch({
        type: "ADD_USER_VOTE",
        payload: { storyID: story.id, vote: -1 },
      });
    } else {
      // if there is a vote and it is not already -1, change the vote to -1
      if (userVote != -1) {
        dispatch({
          type: "SET_USER_VOTE",
          payload: { storyID: story.id, vote: -1 },
        });
      } else {
        // if there is a vote and it is already -1, DELETE the vote row from the user_story_votes table
        dispatch({ type: "DELETE_USER_VOTE", payload: story.id });
      }
    }
    // then retrieve the stories again
    dispatch({ type: "FETCH_ALL_STORIES" });
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "3px",
      }}
    >
      <ArrowUpwardIcon
        color={userVote == 1 ? "voted" : "black"}
        onClick={handleUpvote}
      />
      <Box>{story.vote_count ? story.vote_count : "0"}</Box>
      <ArrowDownwardIcon
        color={userVote == -1 ? "voted" : "black"}
        onClick={handleDownvote}
      />
    </Box>
  );
}

export default UpvoteDownvote;
