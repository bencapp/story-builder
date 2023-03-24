import { Grid, Box, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import TextToDisplay from "./TextToDisplay/TextToDisplay";
import StoryTypeTag from "../StoryTypeTag/StoryTypeTag";

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
              height: "67px",
              backgroundColor: theme.palette.secondary.dark,
              fontWeight: "bold",
              fontSize: "20px",
              display: "flex",
              alignItems: "start",
              justifyContent: "space-between",
              padding: "10px 15px 0px",
            }}
          >
            <Box sx={{ fontSize: "35px", paddingTop: "8px" }}>
              {story.title}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {story.texts[0].username} and {story.texts[1].username}
              <Box
                sx={{
                  display: "flex",
                  gap: "7px",
                  fontWeight: "regular",
                  alignSelf: "end",
                }}
              >
                <StoryTypeTag type={story.length_type} />
                <StoryTypeTag type={story.speed_type} />
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box
              // styling for word by word:
              sx={{
                width: "90%",
                height: "100%",
                fontSize: "30px",
                padding: "15px",
                display: "flex",
                flexWrap: "wrap",
                alignContent: "flex-start",
                overflow: "scroll",
              }}
            >
              {story.texts.map((text, i, textsArray) => (
                <TextToDisplay
                  key={i}
                  text={text}
                  previousText={textsArray[i - 1]}
                />
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default StoryView;
