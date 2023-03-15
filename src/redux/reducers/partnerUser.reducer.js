// this reducer is just for storing which user was invited when creating a new story
const partnerUser = (state = "", action) => {
  switch (action.type) {
    case "SET_PARTNER_USER":
      return action.payload;
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default partnerUser;
