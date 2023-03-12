import { useSelector } from "react-redux";
import { useEffect } from "react";

function NewStory({ socket }) {
  const invitedUser = useSelector((store) => store.pendingInvite);

  useEffect(() => {
    socket.on("accept invite", (user1, user2) => {
      console.log("accepted invite, starting story with", user1, "and", user2);
    });
  }, []);

  return (
    <>
      <h3>Create a new story</h3>
      <p>Invite pending to: {invitedUser.username}</p>
    </>
  );
}

export default NewStory;
