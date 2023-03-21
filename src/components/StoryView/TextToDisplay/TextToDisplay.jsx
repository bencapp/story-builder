import { Box } from "@mui/system";
import { Tooltip } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function TextToDisplay({ text, previousText }) {
  const [hovering, setHovering] = useState(false);
  const [secondsToWrite, setSecondsToWrite] = useState(0);

  const story = useSelector((store) => store.storyToView);

  useEffect(() => {
    // the timestamp of the last text added. If this is the first text, make lastTime the time that the story started
    const lastTime = previousText
      ? new Date(previousText.timestamp)
      : new Date(story.start_time);
    // the timestamp of the current text
    const time = new Date(text.timestamp);

    setSecondsToWrite((time.getTime() - lastTime.getTime()) / 1000);
  }, []);

  return (
    <Tooltip
      title={
        <Box sx={{ fontSize: "medium" }}>
          <Box>
            Written by: <b>{text.username}</b>
          </Box>
          <Box>
            Time to write: <b>{secondsToWrite}</b> seconds
          </Box>
        </Box>
      }
      placement="bottom"
      arrow
    >
      <Box
        sx={{
          padding: hovering ? "2px" : "3px",
          border: hovering ? `1px solid red` : "none",
          height: "1em",
        }}
        å
      >
        {text.text}
        {/* This is the dialog box that will display on hover */}
        {/* It shows the text information: time taken to write it */}
        {/* and the user who wrote it */}
      </Box>
      {/* {hovering && <DetailsBox text={text} />} */}
    </Tooltip>
  );
}

export default TextToDisplay;
