import { Box } from "@mui/system";
import { Tooltip } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material";

function TextToDisplay({ text, previousText }) {
  const [hovering, setHovering] = useState(false);
  const [secondsToWrite, setSecondsToWrite] = useState(0);

  const story = useSelector((store) => store.storyToView);
  const theme = useTheme();

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
            Written by:{" "}
            <Box
              sx={{
                display: "inline",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {text.username}
            </Box>
          </Box>
          <Box>
            Time to write:{" "}
            <Box
              sx={{
                display: "inline",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {secondsToWrite}
            </Box>{" "}
            seconds
          </Box>
        </Box>
      }
      placement="bottom"
      arrow
      onClose={() => setHovering(false)}
      onOpen={() => setHovering(true)}
    >
      <Box
        sx={{
          padding: hovering ? "2px" : "3px",
          border: hovering ? `1px solid red` : "none",
          borderRadius: "2px",
        }}
      >
        {text.text}
      </Box>
    </Tooltip>
  );
}

export default TextToDisplay;
