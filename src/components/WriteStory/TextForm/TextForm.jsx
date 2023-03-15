import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../../socket";

function TextForm() {
  const dispatch = useDispatch();
  // current value in form
  const [newText, setNewText] = useState("");

  const currentUser = useSelector((store) => store.user);
  const currentStory = useSelector((store) => store.currentStory);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("in handleSubmit");
    // check if text is a valid entry. for base mode, only single words are valid
    const regex = new RegExp("^[A-Za-z'\"]+$");
    if (regex.test(newText)) {
      console.log("sending new text:", newText);
      // add text to specified room
      console.log("current story is", currentStory);
      dispatch({
        type: "POST_TEXT",
        payload: {
          storyID: currentStory.id,
          userID: currentUser.id,
          text: newText,
        },
      });
      // format is emit type, text, user, room
      socket.emit("add text", newText, currentUser, "test-room");
      setNewText("");
    } else {
      console.log("invalid entry");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Write the next word!"
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
      ></input>
      <button type="submit">SUBMIT</button>
    </form>
  );
}

export default TextForm;
