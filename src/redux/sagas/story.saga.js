import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

import { socket } from "../../socket";

function* postStory(action) {
  try {
    console.log("in post story, action.payload is", action.payload);
    const response = yield axios.post("/api/story", action.payload);
    // after story is created, set the current story to that story
    // NOTE: probably needs to happen via socket
    // yield put({ type: "SET_CURRENT_STORY" });
    const storyID = response.data.currentStoryID;
    console.log("posted story, story ID is", storyID);
    // set the current story id for the current user
    yield put({ type: "SET_CURRENT_STORY_ID", payload: storyID });
    yield put({
      type: "SET_FIRST_PLAYER_ID",
      payload: response.data.firstPlayerID,
    });
    // send both the invite and the current story ID so that
    // other user can join the same room
    // socket rooms are defined by the ID of the story being written
    yield socket.emit("accept invite", action.payload.invite, storyID);
  } catch (error) {
    console.log("Story POST request failed", error);
  }
}

function* makeStoryPublic(action) {
  try {
    yield axios.put(`/api/story/public/${action.payload}`);
  } catch (error) {
    console.log("Story PUT request failed", error);
  }
}

function* 

function* storySaga() {
  yield takeEvery("POST_STORY", postStory);
  yield takeEvery("MAKE_STORY_PUBLIC", makeStoryPublic);
}

export default storySaga;
