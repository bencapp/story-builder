import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

// action.payload should be the story ID
function* fetchUserVotes() {
  try {
    const response = yield axios.get(`/api/vote/`);
    // this reducer holds the user's current votes for ALL the stories shown
    console.log("got user votes from server, response.data is", response.data);
    yield put({ type: "SET_USER_VOTES", payload: response.data });
  } catch (error) {
    console.log("vote get request failed", error);
  }
}

function* addUserVote() {
  //   try {
  //       yield axios.
  //   } catch (error) {
  //   }
}

function* voteSaga() {
  yield takeEvery("FETCH_USER_VOTES", fetchUserVotes);
  yield takeEvery("ADD_USER_VOTE", addUserVote);
}

export default voteSaga;