// this reducer is just for storing which user will go first
// options are either 'recipient' or 'sender'
const firstPlayerID = (state = "", action) => {
  switch (action.type) {
    case "SET_FIRST_PLAYER_ID":
      return action.payload;
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default firstPlayerID;
