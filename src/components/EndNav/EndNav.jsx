import "./EndNav.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import UsersList from "./UsersList/UsersList";
import ReceivedInvitesList from "./ReceivedInvitesList/ReceivedInvitesList";
import SentInvitesList from "./SentInvitesList/SentInvitesList";

import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function EndNav() {
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: theme.palette.primary.main }} className="nav">
      <UsersList />
      <ReceivedInvitesList />
      <SentInvitesList />
    </Box>
  );
}

export default EndNav;
