import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchInvites() {
  try {
    const response = yield axios.get("/api/invite");
    yield put({ type: "SET_INVITES", payload: response.data });
  } catch (error) {
    console.log("Invite GET request failed", error);
  }
}

function* postInvite(action) {
  try {
    yield axios.post("/api/invite", action.payload);
  } catch (error) {
    console.log("Invite POST request failed", error);
  }
}

function* invitesSaga() {
  yield takeEvery("FETCH_INVITES", fetchInvites);
  yield takeEvery("POST_INVITE", postInvite);
}

export default invitesSaga;
