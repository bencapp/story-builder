const receivedInvites = (state = [], action) => {
  switch (action.type) {
    case "SET_RECEIVED_INVITES":
      return action.payload;
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default receivedInvites;
