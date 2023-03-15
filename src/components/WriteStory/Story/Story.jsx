import { Box } from "@mui/system";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../../socket";

import TextElement from "../TextElement/TextElement";
import TextForm from "../TextForm/TextForm";

function Story() {
  // full story, store as an array
  const [story, setStory] = useState([]);
  const currentUser = useSelector((store) => store.user);
  const outOfTime = useSelector((store) => store.outOfTime);

  const dispatch = useDispatch();

  useEffect(() => {
    // update story when text is added
    socket.on("add text", (text, user) => {
      console.log("received text from user", user, "text is", text);
      setStory((story) => [...story, { text, user }]);
      // change whose turn it is
      dispatch({ type: "TOGGLE_MY_TURN" });
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
          myText={textObject.user.id == currentUser.id}
        />
      ))}
      {!outOfTime ? (
        <TextForm />
      ) : (
        <Box>
          Out of time! Post story to app?<Button>POST</Button>
        </Box>
      )}
    </Box>
  );
}

export default Story;
