const currentStoryTypes = (state = {}, action) => {
    switch (action.type) {
      case "SET_CURRENT_STORY_TYPES":
        return action.payload;
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default currentStoryTypes;
  