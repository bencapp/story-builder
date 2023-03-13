import React from "react";
import { useHistory } from "react-router-dom";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";

import { Button } from "@mui/material";

import "./Nav.css";

function Nav() {
  const user = useSelector((store) => store.user);
  const history = useHistory();

  return (
    <div className="nav">
      <div className="nav-contents">
        <p>StoryBuilder</p>
        {user && <h3>{user.username}</h3>}

        <>
          {/* If no user is logged in, show these links */}
          {!user.id && (
            <>
              {/* If there's no user, show login/registration links */}
              <Button
                onClick={() => {
                  history.push("/login");
                }}
              >
                Login / Register
              </Button>
              {/* also show a nav button to the main feed page */}
              <Button
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
                onClick={() => {
                  history.push("/user");
                }}
              >
                My Feed
              </Button>
              <Button
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
            onClick={() => {
              history.push("/about");
            }}
          >
            ABOUT
          </Button>
        </>
      </div>
    </div>
  );
}

export default Nav;
