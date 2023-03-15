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

  const handleSubmit = (event) => {
    event.preventDefault();
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
      socket.emit(
        "add text",
        newText,
        currentUser,
        `room-story-id-${currentStoryID}`
      );
      setNewText("");
    } else {
      console.log("invalid entry");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        id="next-word-input"
        onSubmit={handleSubmit}
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        placeholder="Next Word"
      ></input>
      {/* <button type="submit">SUBMIT</button> */}
    </form>
  );
}

export default TextForm;
