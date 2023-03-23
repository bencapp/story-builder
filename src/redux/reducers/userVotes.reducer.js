const userVotes = (state = {}, action) => {
  switch (action.type) {
    case "SET_USER_VOTES":
      return action.payload;
    default:
      return state;
  }
};

export default userVotes;
