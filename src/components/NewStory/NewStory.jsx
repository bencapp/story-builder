import { useSelector } from "react-redux";

function NewStory() {
  const invitedUser = useSelector((store) => store.pendingInvite);

  return (
    <>
      <h3>Create a new story</h3>
      <p>Invite pending to: {invitedUser.username}</p>
    </>
  );
}

export default NewStory;
