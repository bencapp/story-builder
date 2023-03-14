import { useState } from "react";
import { socket } from "../../../socket";

function TextForm() {
  // current value in form
  const [newText, setNewText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("in handleSubmit");
    // check if text is a valid entry. for base mode, only single words are valid
    const regex = new RegExp("^[A-Za-z'\"]+$");
    if (regex.test(newText)) {
      console.log("sending new text:", newText);
      // add text to specified room
      socket.emit("add text", newText, "test-room");
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
