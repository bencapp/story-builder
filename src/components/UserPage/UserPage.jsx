import React from "react";
import { useSelector } from "react-redux";

function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);

  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>
        This is your user home page. Here you can view your feed of all the new
        stories on the app.
      </p>
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
