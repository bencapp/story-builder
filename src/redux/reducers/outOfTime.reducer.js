// this reducer is just for storing whether it is the current user's turn
const outOfTime = (state = false, action) => {
    switch (action.type) {
      case "SET_OUT_OF_TIME":
        return action.payload;
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default outOfTime;
  