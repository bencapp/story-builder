import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { socket } from "../../../socket";

import { Button } from "@mui/material";

import ReceivedInviteElement from "./ReceivedInviteElement/ReceivedInviteElement";

function ReceivedInvitesList() {
  const invites = useSelector((store) => store.receivedInvites);
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector((store) => store.user);
  const currentStoryID = useSelector((store) => store.currentStoryID);

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
    socket.on("accept invite", (invite, storyID) => {
      // if the current user was the one to send the invite
      if (invite.sender_user_id == currentUser.id) {
        console.log(
          "invite accepted, joining room and rerouting. invite is",
          invite,
          "storyID is",
          storyID
        );

        // current user needs to join the room
        socket.emit("join room", storyID);

        // fetch invites to update the DOM for the user whose invitation
        // was accepted
        dispatch({ type: "FETCH_PENDING_INVITES" });

        // set current story to the new story
        dispatch({ type: "SET_CURRENT_STORY_ID", payload: storyID });

        dispatch({
          type: "SET_INVITE_ACCEPTED",
          payload: { invite: invite, storyID: storyID },
        });
      }
    });
  }, [currentUser]);

  return (
    <div>
      <div id="invites-list">
        <h3>Invitations</h3>
        <section>
          {invites &&
            invites.map((invite) => (
              <ReceivedInviteElement key={invite.id} invite={invite} />
            ))}
        </section>
      </div>
    </div>
  );
}

export default ReceivedInvitesList;
