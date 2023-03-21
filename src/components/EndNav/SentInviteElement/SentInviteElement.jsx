import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { Box } from "@mui/system";
import { Button, Tooltip } from "@mui/material";

import StoryTypeTag from "../../StoryTypeTag/StoryTypeTag";

function SentInviteElement({ invite }) {
  const theme = useTheme();
  const dispatch = useDispatch();

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
              Cancel
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
          fontSize: "1.5vw",
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

export default SentInviteElement;
