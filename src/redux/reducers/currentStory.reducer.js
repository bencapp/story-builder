const currentStory = (state = "", action) => {
  switch (action.type) {
    case "SET_CURRENT_STORY_ID":
      return action.payload;
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default currentStory;
