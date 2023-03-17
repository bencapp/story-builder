import { Box } from "@mui/system";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../../socket";

import TextElement from "../TextElement/TextElement";
import TextForm from "../TextForm/TextForm";

function Story({ outOfTime }) {
  // full story, store as an array
  const [story, setStory] = useState([]);

  // local state for whether partner has made the story public
  const [displayStoryPublicized, setDisplayStoryPublicized] = useState(false);

  const currentUser = useSelector((store) => store.user);
  // const outOfTime = useSelector((store) => store.outOfTime);
  const partnerUser = useSelector((store) => store.partnerUser);
  const currentStoryID = useSelector((store) => store.currentStoryID);
  const firstPlayerID = useSelector((store) => store.firstPlayerID);
  const myTurn = useSelector((store) => store.myTurn);

  const dispatch = useDispatch();

  useEffect(() => {
    // on load, tell the server to start the clock
    // only emit a start clock for the first player so that
    // only one clock is running for the room
    console.log("starting story, firstPlayerID is", firstPlayerID);
    socket.emit(
      "start clock",
      currentUser.id,
      partnerUser.id,
      currentStoryID,
      firstPlayerID
    );

    // update story when text is added
    socket.on("add text", (text, user) => {
      console.log("received text from user", user, "text is", text);
      setStory((story) => [...story, { text, user }]);
      // change whose turn it is
      dispatch({ type: "TOGGLE_MY_TURN" });
    });

    // when story is made public by a partner user, notify
    // the other user and refresh the page for both users
    socket.on("make story public", (senderUserID) => {
      if (senderUserID !== currentUser.id) {
        setDisplayStoryPublicized(true);
      }
    });
  }, [currentStoryID]);

  const handleSetPublic = () => {
    dispatch({ type: "MAKE_STORY_PUBLIC", payload: currentStoryID });
    socket.emit("make story public", currentStoryID, currentUser.id);
  };

  return (
    <Box
      sx={{ fontSize: "25px", display: "flex", flexWrap: "wrap", gap: "5px" }}
    >
      {story.map((textObject, i) => (
        <TextElement
          key={i}
          text={textObject.text}
          myText={textObject.user == currentUser.id}
        />
      ))}
      {!outOfTime ? (
        <TextForm />
      ) : !displayStoryPublicized ? (
        <Box>
          Out of time! Click submit to make the story public.
          <Button onClick={handleSetPublic}>SUBMIT</Button>
        </Box>
      ) : (
        <Box>Your collaborator has made the story public. Rerouting...</Box>
      )}
    </Box>
  );
}

export default Story;
