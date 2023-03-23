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

function* addUserVote(action) {
  try {
    yield axios.post(`/api/vote/${action.payload.storyID}`, {
      vote: action.payload.vote,
    });
    // then retrieve the stories again
    yield put({ type: "FETCH_ALL_STORIES" });
    yield put({ type: "FETCH_USER_VOTES" });
  } catch (error) {
    console.log("vote POST request failed", error);
  }
}

function* setUserVote(action) {
  try {
    yield axios.put(`/api/vote/${action.payload.storyID}`, {
      vote: action.payload.vote,
    });
    // then retrieve the stories again
    yield put({ type: "FETCH_ALL_STORIES" });
    yield put({ type: "FETCH_USER_VOTES" });
  } catch (error) {
    console.log("vote POST request failed", error);
  }
}

function* deleteUserVote(action) {
  try {
    yield axios.delete(`/api/vote/${action.payload}`);
    // then retrieve the stories again
    yield put({ type: "FETCH_ALL_STORIES" });
    yield put({ type: "FETCH_USER_VOTES" });
  } catch (error) {
    console.log("vote POST request failed", error);
  }
}

function* voteSaga() {
  yield takeEvery("FETCH_USER_VOTES", fetchUserVotes);
  yield takeEvery("ADD_USER_VOTE", addUserVote);
  yield takeEvery("SET_USER_VOTE", setUserVote);
  yield takeEvery("DELETE_USER_VOTE", deleteUserVote);
}

export default voteSaga;
