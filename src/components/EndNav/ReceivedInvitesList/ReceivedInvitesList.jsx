import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { socket } from "../../../socket";

import { Button } from "@mui/material";

function ReceivedInvitesList() {
  const invites = useSelector((store) => store.invites);
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: "FETCH_ALL_USERS" });
    dispatch({ type: "FETCH_INVITES" });

    // socket listener to update invites on invitation
    socket.on("private invite", (invite) => {
      console.log("receiving private invite, 'invite' is:", invite);
      if (invite.invitedUserID === currentUser.id) {
        console.log("received invite to current user");
        dispatch({ type: "FETCH_INVITES" });
      }
    });

    // socket listener to for when one's invitation was accepted
    // TODO: allow user to navigate to new story instead of
    // being immediately redirected there
    socket.on("accept invite", (sentUser, acceptedUser) => {
      // if user is the one who sent the invite, join the room
      if (currentUser.id == sentUser.id) {
        console.log("invite accepted, joining room and rerouting");
        socket.emit("join room", currentUser);

        // and redirect to the new story page
        // if (location.pathname !== "/new-story") {
        //   history.push("/new-story");
        // }
      }
    });
  }, [currentUser]);

  const handleAccept = (invite) => {
    // send socket message saying invite accepted
    socket.emit(
      "accept invite",
      { username: invite.username, id: invite.user_id },
      currentUser
    );
    history.push("/new-story");
    // remove invite from the database
    dispatch({
      type: "DELETE_INVITE",
      payload: invite.invite_id,
    });
    // create a new story
    dispatch({ type: "POST_STORY" });
    // set current story to the new story
  };

  return (
    <div>
      <div id="invites-list">
        <h3>Invitations</h3>
        <section>
          {invites &&
            invites.map((invite) => (
              <div key={invite.invite_id}>
                <p>{invite.username}</p>
                <Button color="tertiary" onClick={() => handleAccept(invite)}>
                  Accept
                </Button>
              </div>
            ))}
        </section>
      </div>
    </div>
  );
}

export default ReceivedInvitesList;
