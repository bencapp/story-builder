import { InputLabel, TextField, Box, Button } from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

function TitleStoryForm() {
  const [newTitle, setNewTitle] = useState("");
  const [showActionCompleted, setShowActionCompleted] = useState(false);
  const dispatch = useDispatch();

  const currentStoryID = useSelector((store) => store.currentStoryID);
  const currentUser = useSelector((store) => store.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("in handleSubmit");
    dispatch({
      type: "SET_STORY_TITLE",
      payload: { storyID: currentStoryID, title: newTitle },
    });

    // make story public
  };

  const handleCancel = () => {
    dispatch({
      type: "DELETE_STORY",
      payload: { storyID: currentStoryID, userID: currentUser.id },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
          textAlign: "center",
          width: "85%",
          fontSize: "15px",
          margin: "20px auto",
        }}
      >
        <Box>
          Your partner ran out of time! That means you get to write a title for
          the story:
        </Box>
        <TextField
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
          sx={{ width: "80%" }}
          inputProps={{ maxLength: 45 }}
        ></TextField>
        <Box>
          Submitting the story will make it public. Press delete to prevent this
          and delete the story.
        </Box>

        <Box sx={{ display: "flex", gap: "10px" }}>
          <Button color="warning" onClick={handleCancel}>
            DELETE
          </Button>
          <Button color="success" type="submit">
            SUBMIT
          </Button>
        </Box>
      </Box>
    </form>
  );
}

export default TitleStoryForm;
