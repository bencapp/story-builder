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

    // if there is no vote yet for the current user, add a vote row to the user_story_votes table
    if (userVote) {
      dispatch({ type: "ADD_USER_VOTE", payload: 1 });
    } else {
      // if there is a vote and it is not already 1, change the vote to 1
      if (userVote != 1) {
        dispatch({ type: "SET_USER_VOTE", payload: 1 });
      } else {
        // if there is a vote and it is already 1, remove the vote row from the user_story_votes table
        dispatch({ type: "REMOVE_USER_VOTE" });
      }
    }

    // if user has already voted the story, remove vote instead of adding it
    // if user switches from upvote to downvote, change story votes by -2
    // if user switches from downvote to upvote, change story votes by +2
  };

  const handleDownvote = () => {
    // if there is no vote yet for the current user, add a vote row to the user_story_votes table
    if (userVote) {
      dispatch({ type: "ADD_USER_VOTE", payload: -1 });
    } else {
      // if there is a vote and it is not already -1, change the vote to -1
      if (userVote != 1) {
        dispatch({ type: "SET_USER_VOTE", payload: -1 });
      } else {
        // if there is a vote and it is already -1, remove the vote row from the user_story_votes table
        dispatch({ type: "REMOVE_USER_VOTE" });
      }
    }
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
      <Box>{story.vote_count}</Box>
      <ArrowDownwardIcon
        color={userVote == -1 ? "voted" : "black"}
        onClick={handleDownvote}
      />
    </Box>
  );
}

export default UpvoteDownvote;
