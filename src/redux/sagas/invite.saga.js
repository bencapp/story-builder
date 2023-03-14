import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchInvites() {
  try {
    const response = yield axios.get("/api/invite");
    console.log("got invites, response is", response);
    yield put({ type: "SET_INVITES", payload: response.data });
  } catch (error) {
    console.log("Invite GET request failed", error);
  }
}

function* fetchPendingInvites() {
  try {
    const response = yield axios.get("/api/invite/pending");
    console.log("got pending invites, response is", response);
    yield put({ type: "SET_PENDING_INVITES", payload: response.data });
  } catch (error) {
    console.log("Pending invite GET request failed", error);
  }
}

function* postInvite(action) {
  try {
    yield axios.post("/api/invite", action.payload);
  } catch (error) {
    console.log("Invite POST request failed", error);
  }
}

function* deleteInvite(action) {
  try {
    // action.payload should be the id of the user who accepted the invitation
    console.log("in delete saga, action is", action);
    yield axios.delete(`/api/invite/${action.payload}`);
    yield put({ type: "FETCH_INVITES" });
  } catch (error) {
    console.log("Invite DELETE request failed", error);
  }
}

function* inviteSaga() {
  yield takeEvery("FETCH_INVITES", fetchInvites);
  yield takeEvery("FETCH_PENDING_INVITES", fetchPendingInvites);
  yield takeEvery("POST_INVITE", postInvite);
  yield takeEvery("DELETE_INVITE", deleteInvite);
}

export default inviteSaga;
