import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Box } from "@mui/system";

import StoryListItem from "../StoryListItem/StoryListItem";

// myStories is a boolean: if true, we should fetch stories by user

function MainFeed({ myStories }) {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);
  const allStories = useSelector((store) => store.allStories);
  const userVotes = useSelector((store) => store.userVotes);

  useEffect(() => {
    // on load, get all stories from the database.
    // all stories is an array stored in the allStories reducer
    if (myStories) {
      dispatch({ type: "FETCH_STORIES_BY_USER", payload: user.id });
    } else {
      dispatch({ type: "FETCH_ALL_STORIES" });
    }

    // also get whether the current user has voted on the stories
    dispatch({
      type: "FETCH_USER_VOTES",
    });
  }, []);

  return (
    <Box sx={{ margin: "15px" }}>
      {user.username ? <h2>Welcome, {user.username}!</h2> : <h2>Welcome!</h2>}
      {myStories ? (
        <p>
          This is the user stories page. Here you can view all the stories that
          you contributed to.
        </p>
      ) : (
        <p>
          This is the home page. Here you can view all the new stories on the
          app.
        </p>
      )}
      <p>
        {!user.username && <span>To start writing, login or register.</span>}
      </p>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
