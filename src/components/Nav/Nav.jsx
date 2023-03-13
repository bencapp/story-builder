import React from "react";
import { useHistory } from "react-router-dom";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";

import { Button, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import "./Nav.css";

function Nav() {
  const user = useSelector((store) => store.user);
  const history = useHistory();
  const theme = useTheme();
  return (
    <Box sx={{ backgroundColor: theme.palette.primary.main }} className="nav">
      <div className="nav-contents">
        <p>StoryBuilder</p>
        {user && <h3>{user.username}</h3>}

        <>
          {/* If no user is logged in, show these links */}
          {!user.id && (
            <>
              {/* If there's no user, show login/registration links */}
              <Button
                color="tertiary"
                onClick={() => {
                  history.push("/login");
                }}
              >
                Login / Register
              </Button>
              {/* also show a nav button to the main feed page */}
              <Button
                color="tertiary"
                onClick={() => {
                  history.push("/home");
                }}
              >
                View Stories
              </Button>
            </>
          )}

          {/* If a user is logged in, show these links */}
          {user.id && (
            <>
              <Button
                color="tertiary"
                onClick={() => {
                  history.push("/user");
                }}
              >
                My Feed
              </Button>
              <Button
                color="tertiary"
                onClick={() => {
                  history.push("/user-stories");
                }}
              >
                My Stories
              </Button>

              <LogOutButton />
            </>
          )}

          <Button
            color="tertiary"
            onClick={() => {
              history.push("/about");
            }}
          >
            ABOUT
          </Button>
        </>
      </div>
    </Box>
  );
}

export default Nav;
