import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* postStory(action) {
  try {
    console.log("in post story, action.payload is", action.payload);
    yield axios.post("/api/story", { title: action.payload });
  } catch (error) {
    console.log("Story POST request failed", error);
  }
}

function* storySaga() {
  yield takeEvery("POST_STORY", postStory);
}

export default storySaga;
