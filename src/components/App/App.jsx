import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";

import { useTheme } from "@mui/material";

import Nav from "../Nav/Nav";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import AboutPage from "../AboutPage/AboutPage";
import LoginPage from "../LoginPage/LoginPage";
import MainFeed from "../MainFeed/MainFeed";
import StoryView from "../StoryView/StoryView";
import WriteStory from "../WriteStory/WriteStory";
import RegisterPage from "../RegisterPage/RegisterPage";
import EndNav from "../EndNav/EndNav";
import NewInvitation from "../NewInvitation/NewInvitation";
import InviteAcceptedPopup from "../InviteAcceptedPopup/InviteAcceptedPopup";

import "./App.css";

function App() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);
  const inviteAccepted = useSelector((store) => store.inviteAccepted);

  const theme = useTheme();

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  return (
    <Router>
      <Grid container direction="row" id="app-container">
        <Grid item xs={2} sx={{ display: "flex" }}>
          <Nav />
        </Grid>
        <Grid item xs={8}>
          {/* If the invite accepted reducer has a value, render the invite accepted popup */}
          {Object.keys(inviteAccepted).length > 0 && <InviteAcceptedPopup />}
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/home" />

            {/* Visiting localhost:3000/about will show the about page. */}
            <Route
              // shows AboutPage at all times (logged in or not)
              exact
              path="/about"
            >
              <AboutPage />
            </Route>

            <Route
              // everyone can see the home page
              exact
              path="/home"
            >
              <MainFeed myStories={false} />
            </Route>

            <Route exact path="/story/:id">
              <StoryView />
            </Route>

            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
            <ProtectedRoute
              // logged in shows InfoPage else shows LoginPage
              exact
              path="/new-story"
            >
              <WriteStory />
            </ProtectedRoute>

            <ProtectedRoute
              // logged in shows InfoPage else shows LoginPage
              exact
              path="/new-invitation"
            >
              <NewInvitation />
            </ProtectedRoute>

            <ProtectedRoute
              // logged in shows InfoPage else shows LoginPage
              exact
              path="/user-stories"
            >
              <MainFeed myStories={true} />
            </ProtectedRoute>

            <Route exact path="/login">
              {user.id ? (
                // If the user is already logged in,
                // redirect to the /home page
                <Redirect to="/home" />
              ) : (
                // Otherwise, show the login page
                <LoginPage />
              )}
            </Route>

            <Route exact path="/registration">
              {user.id ? (
                // If the user is already logged in,
                // redirect them to the /home page
                <Redirect to="/home" />
              ) : (
                // Otherwise, show the registration page
                <RegisterPage />
              )}
            </Route>

            <Route exact path="/home">
              {user.id ? (
                // If the user is already logged in,
                // redirect them to the /user page
                <Redirect to="/home" />
              ) : (
                // Otherwise, show the Landing page
                <MainFeed />
              )}
            </Route>

            {/* If none of the other routes matched, we will show a 404. */}
            <Route>
              <h1>404</h1>
            </Route>
          </Switch>
        </Grid>
        <Grid item xs={2}>
          <EndNav />
        </Grid>
      </Grid>
    </Router>
  );
}

export default App;
