import { Box } from "@mui/system";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@emotion/react";

function UpvoteDownvote({ story }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const currentUser = useSelector((store) => store.user);

  useEffect(() => {
    // on load, get whether user has already voted on this story
  
  });

  const handleUpvote = () => {
    // update story votes based on vote
    // if user has already voted the story, remove vote instead of adding it
    // if user switches from upvote to downvote, change story votes by -2
    // if user switches from downvote to upvote, change story votes by +2
  };

  const handleDownvote = () => {};

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
      <ArrowUpwardIcon color="voted" onClick={handleUpvote} />
      <Box>{story.votes}</Box>
      <ArrowDownwardIcon onClick={handleDownvote} />
    </Box>
  );
}

export default UpvoteDownvote;
