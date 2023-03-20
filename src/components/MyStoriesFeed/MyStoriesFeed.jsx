import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Box } from "@mui/system";

import StoryListItem from "../StoryListItem/StoryListItem";

function MyStoriesFeed() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);
  const allStories = useSelector((store) => store.allStories);

  useEffect(() => {
    // on load, get all stories from the database.
    // all stories is an array stored in the allStories reducer
    dispatch({ type: "FETCH_STORIES_BY_USER", payload: user.id });
  }, []);

  return (
    <Box sx={{ margin: "15px" }}>
      {<h2>Welcome, {user.username}!</h2>}
      <p>
        This is the user stories page. Here you can view all the stories on the
        app that you have contributed to.
      </p>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {allStories.map((story) => (
          <StoryListItem key={story.id} story={story} />
        ))}
      </Box>
    </Box>
  );
}

export default MyStoriesFeed;