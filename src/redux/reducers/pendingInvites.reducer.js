// PENDING INVITE: STATE IS THE USER OBJECT

const pendingInvites = (state = [], action) => {
  switch (action.type) {
    case "SET_PENDING_INVITES":
      return action.payload;
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default pendingInvites;
