import axios from "axios";
import { put, takeLatest, takeEvery } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchInvites() {
  try {
    const response = yield axios.get("/api/invite");
    yield put({ type: "SET_INVITES", payload: response.data });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* invitesSaga() {
  yield takeEvery("FETCH_INVITES", fetchInvites);
}

export default invitesSaga;
