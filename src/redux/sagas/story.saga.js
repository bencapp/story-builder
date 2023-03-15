import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* postStory(action) {
  try {
    console.log("in post story, action.payload is", action.payload);
    const response = yield axios.post("/api/story", action.payload);
    // after story is created, set the current story to that story
    // NOTE: probably needs to happen via socket
    // yield put({ type: "SET_CURRENT_STORY" });
    console.log("posted story, story ID is", response.data);
    yield put({ type: "SET_CURRENT_STORY_ID", payload: response.data });
  } catch (error) {
    console.log("Story POST request failed", error);
  }
}

function* storySaga() {
  yield takeEvery("POST_STORY", postStory);
}

export default storySaga;
