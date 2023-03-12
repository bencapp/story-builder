import React from "react";
import { Link } from "react-router-dom";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";

import "./Nav.css";

function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <div className="nav">
      <div className="nav-contents">
        <h3>{user.username}</h3>
        <Link to="/home">
          <h2 className="nav-title">StoryBuilder</h2>
        </Link>
        <>
          {/* If no user is logged in, show these links */}
          {!user.id && (
            // If there's no user, show login/registration links
            <Link className="navLink" to="/login">
              Login / Register
            </Link>
          )}

          {/* If a user is logged in, show these links */}
          {user.id && (
            <>
              <Link className="navLink" to="/user">
                Home
              </Link>

              <LogOutButton className="navLink" />
            </>
          )}

          <Link className="navLink" to="/about">
            About
          </Link>
        </>
      </div>
    </div>
  );
}

export default Nav;
