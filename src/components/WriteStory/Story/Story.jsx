import { Box } from "@mui/system";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../../socket";
import { useHistory } from "react-router-dom";

import TextElement from "../TextElement/TextElement";
import TextForm from "../TextForm/TextForm";
import TitleStoryForm from "./TitleStoryForm/TitleStoryForm";
import TitleFormCompletedMessage from "./TitleFormCompletedMessage/TitleFormCompletedMessage";

function Story({ outOfTime, outOfTimeUserID }) {
  const history = useHistory();
  // full story, store as an array
  const [story, setStory] = useState([]);

  const currentUser = useSelector((store) => store.user);
  // const outOfTime = useSelector((store) => store.outOfTime);
  const partnerUser = useSelector((store) => store.partnerUser);
  const currentStoryID = useSelector((store) => store.currentStoryID);
  const firstPlayerID = useSelector((store) => store.firstPlayerID);

  const [storyPublished, setStoryPublished] = useState([false, ""]);
  const [storyDeleted, setStoryDeleted] = useState([false, ""]);

  const [title, setTitle] = useState("");

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
    socket.on("make story public", (senderUserID, newTitle) => {
      console.log("received make story public, title is", newTitle);
      setStoryPublished([true, senderUserID]);
      setTitle(newTitle);
    });

    socket.on("deleted story", (senderUserID) => {
      setStoryDeleted([true, senderUserID]);
    });
  }, [currentStoryID]);

  const handleGoHome = () => {
    history.push("/home");
    window.location.reload(false);
  };

  return (
    <Box
      sx={{
        border: "1px solid black",
        padding: "15px",
        borderRadius: "5px",
        height: "94%",
      }}
    >
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
        {!outOfTime && <TextForm />}
      </Box>
      {/* If we are not out of time, display the text form */}
      {/* // if the story is too short, display that it is too short to post and reroute */}
      {outOfTime && story.length < 2 ? (
        <>
          <Box sx={{ fontsize: "15px", marginBottom: "15px" }}>
            This story is too short to post! Both players need to write at least
            one word. Invite your partner to a new game!
          </Box>
          <Button onClick={handleGoHome}>HOME PAGE</Button>
        </>
      ) : // if story was deleted, display the relevant message
      outOfTime && storyDeleted[0] ? (
        <TitleFormCompletedMessage
          actingUserID={storyDeleted[1]}
          type={"deleted"}
          title={title}
        />
      ) : // if the story was posted, display the relevant message
      outOfTime && storyPublished[0] ? (
        <TitleFormCompletedMessage
          actingUserID={storyPublished[1]}
          type={"published"}
          title={title}
        />
      ) : // When time runs out, display either the title story form or a message
      // that your partner is titling the story
      outOfTime && outOfTimeUserID == currentUser.id ? (
        <Box sx={{ fontSize: "20px", marginTop: "10px" }}>
          You ran out of time! Your partner is choosing a title for the story...
        </Box>
      ) : outOfTime ? (
        <TitleStoryForm />
      ) : (
        <Box></Box>
      )}
    </Box>
  );
}

export default Story;
