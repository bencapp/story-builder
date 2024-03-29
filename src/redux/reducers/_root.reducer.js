import { combineReducers } from "redux";
import errors from "./errors.reducer";
import user from "./user.reducer";
import allUsers from "./allUsers.reducer";
import receivedInvites from "./receivedInvites.reducer";
import pendingInvites from "./pendingInvites.reducer";
import invitedUser from "./invitedUser.reducer";
import partnerUser from "./partnerUser.reducer";
import currentStoryID from "./currentStoryID.reducer";
import firstPlayerID from "./firstPlayerID.reducer";
import myTurn from "./myTurn.reducer";
import allStories from "./allStories.reducer";
import storyToView from "./storyToView.reducer";
import inviteAccepted from "./inviteAccepted.reducer";
import currentStoryTypes from "./currentStoryTypes.reducer";
import userVotes from "./userVotes.reducer";

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  allUsers,
  receivedInvites,
  pendingInvites,
  invitedUser,
  partnerUser,
  currentStoryID,
  firstPlayerID,
  myTurn,
  allStories,
  storyToView,
  inviteAccepted,
  currentStoryTypes,
  userVotes,
});

export default rootReducer;
