import { all } from "redux-saga/effects";
import loginSaga from "./login.saga";
import registrationSaga from "./registration.saga";
import userSaga from "./user.saga";
import inviteSaga from "./invite.saga";
import storySaga from "./story.saga";
import textSaga from "./text.saga";
import turnSaga from "./turn.saga";
import voteSaga from "./vote.saga";

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    loginSaga(), // login saga is now registered
    registrationSaga(),
    userSaga(),
    inviteSaga(),
    storySaga(),
    textSaga(),
    turnSaga(),
    voteSaga(),
  ]);
}
