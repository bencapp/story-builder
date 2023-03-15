import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* postText(action) {
  try {
    console.log("in post text, action.payload is", action.payload);
    yield axios.post("/api/text", {
      storyID: action.payload.storyID,
      userID: action.payload.userID,
      text: action.payload.text,
    });
  } catch (error) {
    console.log("Text POST request failed", error);
  }
}

function* textSaga() {
  yield takeEvery("POST_TEXT", postText);
}

export default textSaga;
