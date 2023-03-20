import "./EndNav.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import UsersList from "./UsersList/UsersList";
import ReceivedInvitesList from "./ReceivedInvitesList/ReceivedInvitesList";
import SentInvitesList from "./SentInvitesList/SentInvitesList";
import InviteAcceptedPopup from "./InviteAcceptedPopup/InviteAcceptedPopup";

import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function EndNav() {
  const theme = useTheme();

  const user = useSelector((store) => store.user);
  const inviteAccepted = useSelector((store) => store.inviteAccepted);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        // width: "100%",
      }}
      className="nav"
    >
      {/* Only render endnav components if there is a user */}
      {Object.keys(user).length > 0 && (
        <>
          {/* If the invite accepted reducer has a value, render the invite accepted popup */}
          {Object.keys(inviteAccepted).length > 0 && <InviteAcceptedPopup />}
          <UsersList />
          <ReceivedInvitesList />
          <SentInvitesList />
        </>
      )}
    </Box>
  );
}

export default EndNav;
