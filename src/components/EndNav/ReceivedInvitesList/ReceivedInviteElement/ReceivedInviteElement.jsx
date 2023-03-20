import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { socket } from "../../../../socket";
import { Box } from "@mui/system";
import { Button } from "@mui/material";

import StoryTypeTag from "../../../StoryTypeTag/StoryTypeTag";

function ReceivedInviteElement({ invite }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  // when the current user accepts an invite
  const handleAccept = (invite) => {
    // send socket message saying invite accepted
    console.log("accepting invite,", invite);

    // create a new story and post it to the database
    dispatch({
      type: "POST_STORY",
      payload: {
        story: {
          title: invite.title,
          speed_type: invite.speed_type,
          text_type: invite.text_type,
        },
        // send the invite to the postStory saga too so that it can
        // emit "accept invite" to the other user after the story has
        // been posted to the database.
        // This is necessary because the 'accept invite' socket endpoint
        // requires the story ID so that the user can join the correct room
        invite: invite,
      },
    });

    // set the partner user to the user who sent the invite
    dispatch({
      type: "SET_PARTNER_USER",
      payload: {
        id: invite.sender_user_id,
        username: invite.sender_user_username,
        inviteSide: "sender",
      },
    });

    // current user needs to join the room
    socket.emit("join room", currentStoryID);

    history.push("/new-story");
  };
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.secondary.dark,
        zIndex: "10",
        width: "100px",
        height: "100px",
      }}
    >
      <Box>{invite.sender_user_username}</Box>

      <StoryTypeTag type={invite.text_type} />
      <StoryTypeTag type={invite.speed_type} />

      <Button color="tertiary" onClick={() => handleAccept(invite)}>
        Accept
      </Button>
    </Box>
  );
}

export default ReceivedInviteElement;
