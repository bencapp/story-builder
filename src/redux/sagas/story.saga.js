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

function* fetchAllStories() {
  try {
    const response = yield axios.get("/api/story");
    yield put({ type: "SET_ALL_STORIES", payload: response.data });
  } catch (error) {
    console.log("Story GET request failed", error);
  }
}

function* fetchStoriesByUser(action) {
  try {
    // first get all stories
    const response = yield axios.get(`/api/story/user-story/${action.payload}`);
    yield put({ type: "SET_ALL_STORIES", payload: response.data });
  } catch (error) {
    console.log("Story GET request failed", error);
  }
}

function* fetchStoryByID(action) {
  try {
    const response = yield axios.get(`/api/story/story/${action.payload}`);
    yield put({ type: "SET_STORY_TO_VIEW", payload: response.data[0] });
  } catch (error) {
    console.log("Story GET request failed", error);
  }
}

function* setStoryStartTime(action) {
  try {
    yield axios.put(`/api/story/start-time/${action.payload}`);
  } catch (error) {
    console.log("Story PUT request failed", error);
  }
}

function* deleteStory(action) {
  try {
    console.log("in delete story, action.payload is", action.payload);
    yield axios.delete(`/api/story/${action.payload.storyID}`);
  } catch (error) {
    console.log("Story DELETE request failed", error);
  }
}

function* setStoryTitle(action) {
  try {
    console.log("in set story title, action.payload is", action.payload);
    yield axios.put(`/api/story/title/${action.payload.storyID}`, {
      title: action.payload.title,
    });
  } catch (error) {
    console.log("Story PUT request failed", error);
  }
}

function* storySaga() {
  yield takeEvery("POST_STORY", postStory);
  yield takeEvery("MAKE_STORY_PUBLIC", makeStoryPublic);
  yield takeEvery("FETCH_ALL_STORIES", fetchAllStories);
  yield takeEvery("FETCH_STORY_BY_ID", fetchStoryByID);
  yield takeEvery("FETCH_STORIES_BY_USER", fetchStoriesByUser);
  yield takeEvery("SET_STORY_START_TIME", setStoryStartTime);
  yield takeEvery("DELETE_STORY", deleteStory);
  yield takeEvery("SET_STORY_TITLE", setStoryTitle);
}

export default storySaga;
