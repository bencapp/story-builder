import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { socket } from "../../../../socket";
import { Box } from "@mui/system";
import { Button, Tooltip } from "@mui/material";

import StoryTypeTag from "../../../StoryTypeTag/StoryTypeTag";

function ReceivedInviteElement({ invite }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();

  const currentStoryID = useSelector((store) => store.currentStoryID);

  // when the current user accepts an invite
  const handleAccept = (invite) => {
    // send socket message saying invite accepted
    console.log("accepting invite,", invite);

    // create a new story and post it to the database
    dispatch({
      type: "POST_STORY",
      payload: invite,
      // send the invite to the postStory saga too so that it can
      // emit "accept invite" to the other user after the story has
      // been posted to the database.
      // This is necessary because the 'accept invite' socket endpoint
      // requires the story ID so that the user can join the correct room
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

  const handleDecline = (invite) => {
    console.log("deleting invite,", invite);

    dispatch({ type: "DELETE_INVITE", payload: invite.id });
  };

  return (
    <Tooltip
      title={
        <Box
          sx={{
            fontSize: "medium",
            color: "black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
          }}
        >
          <StoryTypeTag type={invite.text_type} />
          <StoryTypeTag type={invite.speed_type} />
          <Box sx={{ display: "flex" }}>
            <Button
              sx={{
                width: "10px",
                fontSize: "10px",
                fontWeight: "bold",
                border: "1px solid black",
                color: "black",
              }}
              color="warning"
              onClick={() => handleDecline(invite)}
            >
              Decline
            </Button>
            <Button
              sx={{
                width: "10px",
                fontSize: "10px",
                fontWeight: "bold",
                border: "1px solid black",
              }}
              color="success"
              onClick={() => handleAccept(invite)}
            >
              Accept
            </Button>
          </Box>
        </Box>
      }
      placement="right"
      arrow
    >
      <Box
        sx={{
          backgroundColor: theme.palette.secondary.main,
          fontSize: "15px",
          padding: "4px 8px",
          borderRadius: "2px",
          textAlign: "center",
          display: "inline-block",
          border: "1px solid black",
          width: "70%",
          height: "auto",
        }}
      >
        <Box sx={{ fontWeight: "bold" }}>{invite.sender_user_username}</Box>
      </Box>
    </Tooltip>
  );
}

export default ReceivedInviteElement;
