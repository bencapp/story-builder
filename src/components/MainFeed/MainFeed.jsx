import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Box } from "@mui/system";

import StoryListItem from "../StoryListItem/StoryListItem";

function MainFeed() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);
  const allStories = useSelector((store) => store.allStories);

  const userVotes = useSelector((store) => store.userVotes);

  useEffect(() => {
    // on load, get all stories from the database.
    // all stories is an array stored in the allStories reducer
    dispatch({ type: "FETCH_ALL_STORIES" });

    // also get whether the current user has voted on the stories
    dispatch({
      type: "FETCH_USER_VOTES",
    });
  }, []);

  return (
    <Box sx={{ margin: "15px" }}>
      {user.username ? <h2>Welcome, {user.username}!</h2> : <h2>Welcome!</h2>}
      <p>
        This is the home page. Here you can view all the new stories on the app.{" "}
        {!user.username && <span>To start writing, login or register.</span>}
      </p>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {allStories
          .sort((a, b) => Number(b.vote_count) - Number(a.vote_count))
          .map((story) => (
            <StoryListItem
              key={story.id}
              story={story}
              userVote={
                userVotes?.length > 0 &&
                userVotes.filter((userVote) => userVote.story_id == story.id)[0]
                  ?.vote
              }
            />
          ))}
      </Box>
    </Box>
  );
}

export default MainFeed;
