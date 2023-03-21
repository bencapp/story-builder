import { Box } from "@mui/system";
import { useTheme } from "@emotion/react";
import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { socket } from "../../socket";

function InviteAcceptedPopup() {
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  // access invite accepted reducer
  // this componenet should only render if inviteAccepted is populated
  const inviteAccepted = useSelector((store) => store.inviteAccepted);

  const handleGoToStory = () => {
    // remove invite accepted from reducer
    dispatch({ type: "CLEAR_INVITE_ACCEPTED" });

    // remove invite from the database
    console.log(inviteAccepted);
    dispatch({
      type: "DELETE_INVITE",
      payload: inviteAccepted.invite.id,
    });

    // set the partner user to the invite recipient
    dispatch({
      type: "SET_PARTNER_USER",
      payload: {
        id: inviteAccepted.invite.recipient_user_id,
        username: inviteAccepted.invite.recipient_user_username,
        inviteSide: "recipient",
      },
    });

    // redirect user to the new story page
    if (location.pathname !== "/new-story") {
      history.push("/new-story");
    }

    // emit socket message to other user saying that you are ready
    socket.emit(
      "ready to start story",
      inviteAccepted.invite,
      inviteAccepted.storyID
    );
  };
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.secondary.main,
        width: "auto",
        height: "30px",
        borderRadius: "5px",
        marginLeft: "55%",
        marginTop: "15px",
        fontSize: "15px",
        position: "absolute",
        zIndex: "15",
        border: "1px solid black",
        padding: "5px",
      }}
    >
      <b>{inviteAccepted.invite.recipient_user_username}</b> just accepted your
      invite!
      <Button
        color="success"
        sx={{
          fontSize: "10px",
          fontWeight: "bold",
          border: "1px solid black",
          color: "black",
          marginLeft: "5px",
        }}
        onClick={handleGoToStory}
      >
        GO TO STORY
      </Button>
    </Box>
  );
}

export default InviteAcceptedPopup;
