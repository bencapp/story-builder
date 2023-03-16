import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

// action.payload is the currentStoryID and currentUserID
function* fetchTurn(action) {
  try {
    const response = yield axios.get(
      `/api/story/turn/${action.payload.currentStoryID}`
    );
    console.log("got turn, response.data is", response.data);
    const myTurn =
      action.payload.currentUserID == response.data[0].current_user_turn_id;
    yield put({ type: "SET_MY_TURN", payload: myTurn });
  } catch (error) {
    console.log("turn GET request failed", error);
  }
}

function* turnSaga() {
  yield takeEvery("FETCH_TURN", fetchTurn);
}

export default turnSaga;
