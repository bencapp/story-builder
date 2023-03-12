import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function NewStory({ socket }) {
  // invited user for setting the display BEFORE invite is accepted
  const invitedUser = useSelector((store) => store.pendingInvite);

  // current user
  const currentUser = useSelector((store) => store.user);

  const [partnerUser, setPartnerUser] = useState();

  // socket room string
  const [room, setRoom] = useState();

  // current value in form
  const [newText, setNewText] = useState("");

  // full story, store as an array
  const [story, setStory] = useState([]);

  useEffect(() => {
    socket.on("accept invite", (user1, user2, room) => {
      // determine who is the partner and who is the current user
      setPartnerUser(user1.id == currentUser.id ? user2 : user1);
      // set the local state room variable
      setRoom(room);
    });

    // update story when text is added
    socket.on("add text", (text) => {
      console.log("received text, text is", text);
      setStory((story) => [...story, text]);
    });
    // return socket.off("add text");
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("sending new text:", newText);
    // add text to specified room
    socket.emit("add text", newText, "test-room");
  };

  return (
    <>
      <h3>Create a new story</h3>
      {!partnerUser ? (
        <p>Invite pending to: {invitedUser.username}</p>
      ) : (
        <>
          <p>Starting new story with {partnerUser.username}</p>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Write the next word!"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            ></input>
            <button type="submit">SUBMIT</button>
          </form>
          <p>
            {story.map((text, i) => (
              <span key={i}>{text} </span>
            ))}
          </p>
        </>
      )}
    </>
  );
}

export default NewStory;
