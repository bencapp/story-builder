const storyToView = (state = {}, action) => {
  switch (action.type) {
    case "SET_STORY_TO_VIEW":
      return action.payload;
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default storyToView;
