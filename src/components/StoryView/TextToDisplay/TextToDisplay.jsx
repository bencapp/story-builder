import { Box } from "@mui/system";
import { Tooltip } from "@mui/material";
import { useState } from "react";

function TextToDisplay({ text }) {
  const [hovering, setHovering] = useState(false);
  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  return (
    <Tooltip title={text.username} placement="bottom" arrow>
      <Box
        sx={{
          padding: hovering ? "2px" : "3px",
          border: hovering ? `1px solid red` : "none",
          height: "1em",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
