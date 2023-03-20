import { Grid, Box, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import TextToDisplay from "./TextToDisplay/TextToDisplay";

function StoryView() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { id } = useParams();
  const story = useSelector((store) => store.storyToView);

  useEffect(() => {
    // on page load, get story by id
    dispatch({ type: "FETCH_STORY_BY_ID", payload: id });
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.secondary.main,
        margin: "60px auto",
        width: "95%",
        height: "85%",
        boxShadow: "1",
      }}
    >
      {story.texts && (
        <>
          <Box
            sx={{
              height: "70px",
              backgroundColor: theme.palette.secondary.dark,
              fontWeight: "bold",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0px 15px",
            }}
          >
            <Box>{story.title}</Box>
            <Box>
              Written by {story.texts[0].username} and {story.texts[1].username}
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              fontSize: "30px",
              padding: "15px",
              display: "flex",
              flexWrap: "wrap",
              alignContent: "flex-start",
            }}
          >
            {story.texts.map((text, i) => (
              <TextToDisplay key={i} text={text} />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

export default StoryView;
