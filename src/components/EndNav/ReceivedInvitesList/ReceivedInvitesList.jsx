import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { socket } from "../../../socket";

import { Button } from "@mui/material";

function ReceivedInvitesList() {
  const invites = useSelector((store) => store.receivedInvites);
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: "FETCH_ALL_USERS" });
    dispatch({ type: "FETCH_INVITES" });

    // socket listener to update invites on invitation
    socket.on("private invite", (invite) => {
      console.log("receiving private invite, 'invite' is:", invite);
      // if the invite is for the current user, perform a fetch invites dispatch
      if (invite.recipient_user_id === currentUser.id) {
        console.log("received invite to current user");
        dispatch({ type: "FETCH_INVITES" });
      }
    });

    // socket listener for when one's invitation was accepted
    // BY ANOTHER USER
    // TODO: allow user to navigate to new story instead of
    // being immediately redirected there
    socket.on("accept invite", (invite) => {
      console.log(
        "invite accepted, joining room and rerouting. invite is",
        invite
      );

      // if user is the one who sent the invite
      // set partner user to the invite recipient
      if (currentUser.id == invite.sender_user_id) {
        dispatch({
          type: "SET_PARTNER_USER",
          payload: {
            id: invite.recipient_user_id,
            username: invite.recipient_user_username,
          },
        });
      } else {
        // if user is the one who accepted the invite,
        // set partner user to the invite sender
        dispatch({
          type: "SET_PARTNER_USER",
          payload: {
            id: invite.sender_user_id,
            username: invite.sender_user_username,
          },
        });
      }
      // current user needs to join the room
      socket.emit("join room", currentUser);

      // set current story reducer to this story
      dispatch({ type: "SET_CURRENT_STORY_ID", payload: invite.story_id });

      // and redirect both users to the new story page
      if (location.pathname !== "/new-story") {
        history.push("/new-story");
      }
    });
  }, [currentUser]);

  // when the current user accepts an invite
  const handleAccept = (invite) => {
    // send socket message saying invite accepted
    console.log("accepting invite,", invite);
    socket.emit("accept invite", invite, currentUser);
    history.push("/new-story");
    // remove invite from the database
    dispatch({
      type: "DELETE_INVITE",
      payload: invite.id,
    });

    // set current story to the new story
    dispatch({ type: "SET_CURRENT_STORY_ID", payload: invite.story_id });
  };

  return (
    <div>
      <div id="invites-list">
        <h3>Invitations</h3>
        <section>
          {invites &&
            invites.map((invite) => (
              <div key={invite.id}>
                <p>{invite.sender_user_username}</p>
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
