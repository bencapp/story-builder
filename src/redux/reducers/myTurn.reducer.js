// this reducer is just for storing whether it is the current user's turn
const myTurn = (state = false, action) => {
  switch (action.type) {
    case "SET_MY_TURN":
      return action.payload;
    case "TOGGLE_MY_TURN":
      return !state;
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default myTurn;
