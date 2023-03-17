import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Box } from "@mui/system";

import StoryListItem from "../StoryListItem/StoryListItem";

function MainFeed() {
  const dispatch = useDispatch();
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);

  const allStories = useSelector((store) => store.allStories);

  useEffect(() => {
    // on load, get all stories from the database.
    // all stories is an array stored in the allStories reducer
    dispatch({ type: "FETCH_ALL_STORIES" });
  }, []);

  return (
    <Box sx={{ margin: "15px" }}>
      <h2>Welcome, {user.username}!</h2>
      <p>
        This is your user home page. Here you can view your feed of all the new
        stories on the app.
      </p>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {allStories.map((story) => (
          <StoryListItem key={story.id} story={story} />
        ))}
      </Box>
    </Box>
  );
}

// this allows us to use <App /> in index.js
export default MainFeed;
