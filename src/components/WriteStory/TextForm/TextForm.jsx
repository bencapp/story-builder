import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../../socket";

import "./TextForm.css";

function TextForm() {
  const dispatch = useDispatch();
  // current value in form
  const [newText, setNewText] = useState("");

  const currentUser = useSelector((store) => store.user);
  const currentStoryID = useSelector((store) => store.currentStoryID);
  const myTurn = useSelector((store) => store.myTurn);
  const partnerUser = useSelector((store) => store.partnerUser);

  // local state for displaying 'not your turn' message
  const [notYourTurnDisplay, setNotYourTurnDisplay] = useState(false);
  const [invalidDisplay, setInvalidDisplay] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!myTurn) {
      setNotYourTurnDisplay(true);
      setTimeout(() => {
        setNotYourTurnDisplay(false);
      }, 1000);
      return;
    }

    console.log("in handleSubmit, newText is", newText);
    // check if text is a valid entry. for base mode, only single words are valid
    const regex = new RegExp("^[A-Za-z'\".!?;:]+$");
    if (regex.test(newText)) {
      console.log("sending new text:", newText);
      // add text to specified room
      console.log("current story is", currentStoryID);
      dispatch({
        type: "POST_TEXT",
        payload: {
          story_id: currentStoryID,
          user_id: currentUser.id,
          text: newText,
        },
      });
      // format is emit type, text, user, room
      // THIS EMIT IS NOT BEING READ
      socket.emit(
        "add text",
        newText,
        currentUser,
        partnerUser,
        `room-story-id-${currentStoryID}`
      );
      setNewText("");
    } else {
      setInvalidDisplay(true);
      setTimeout(() => {
        setInvalidDisplay(false);
      }, 1000);
    }
  };

  return (
    <form id="new-text-form" onSubmit={handleSubmit}>
      <input
        id="next-word-input"
        className={notYourTurnDisplay || invalidDisplay ? "invalid" : "valid"}
        onSubmit={handleSubmit}
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        placeholder="Next Word"
      ></input>
      {notYourTurnDisplay ? (
        <div className="invalid-text">Not your turn!</div>
      ) : invalidDisplay ? (
        <div className="invalid-text">Invalid entry!</div>
      ) : (
        <></>
      )}
      {/* <button type="submit">SUBMIT</button> */}
    </form>
  );
}

export default TextForm;
