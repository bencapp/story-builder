// this reducer is just for storing which user was invited when creating a new story
const inviteAccepted = (state = {}, action) => {
  switch (action.type) {
    case "SET_INVITE_ACCEPTED":
      return action.payload;
    case "CLEAR_INVITE_ACCEPTED":
      return {};
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default inviteAccepted;
