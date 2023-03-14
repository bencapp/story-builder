import { Box } from "@mui/system";
import { useEffect, useState } from "react";

import { socket } from "../../../socket";

import TextElement from "../TextElement/TextElement";

function Story() {
  // full story, store as an array
  const [story, setStory] = useState([]);

  useEffect(() => {
    // update story when text is added
    socket.on("add text", (text, user) => {
      console.log("received text from user", user, "text is", text);
      setStory((story) => [...story, text]);
    });
  }, []);

  return (
    <Box sx={{ fontSize: "30px" }}>
      {story.map((text, i) => (
        <TextElement key={i} text={text} myText={true} />
      ))}
    </Box>
  );
}

export default Story;
