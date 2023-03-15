import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../../socket";

import TextElement from "../TextElement/TextElement";
import TextForm from "../TextForm/TextForm";

function Story() {
  // full story, store as an array
  const [story, setStory] = useState([]);
  const currentUser = useSelector((store) => store.user);

  useEffect(() => {
    // update story when text is added
    socket.on("add text", (text, user_id) => {
      console.log("received text from user", user_id, "text is", text);
      setStory((story) => [...story, { text, user_id }]);
    });
  }, []);

  return (
    <Box
      sx={{ fontSize: "25px", display: "flex", flexWrap: "wrap", gap: "5px" }}
    >
      {story.map((textObject, i) => (
        <TextElement
          key={i}
          text={textObject.text}
          myText={textObject.user_id == currentUser.id}
        />
      ))}
      <TextForm />
    </Box>
  );
}

export default Story;
