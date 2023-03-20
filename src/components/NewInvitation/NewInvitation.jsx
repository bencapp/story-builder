import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import {
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  Box,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { socket } from "../../socket";

function NewInvitation() {
  const history = useHistory();
  const theme = useTheme();
  const dispatch = useDispatch();
  const initialInvitedUser = useSelector((store) => store.invitedUser);
  const currentUser = useSelector((store) => store.user);
  const allUsers = useSelector((store) => store.allUsers);

  // local state for title
  const [newTitle, setNewTitle] = useState("");

  // local state for user being invited
  const [invitedUser, setInvitedUser] = useState(initialInvitedUser);

  // local state for story text type
  const [storyTextType, setStoryTextType] = useState("word by word");

  // story speed type
  const [storySpeedType, setStorySpeedType] = useState("writer's room");

  // object for amounts of time (in seconds) for each setting
  const timeControls = {
    wordByWord: {
      hypertype: "15 seconds",
      writersRoom: "30 seconds",
      quillAndParchment: "90 seconds",
    },
    sentenceBySentence: {
      hypertype: "90 seconds",
      writersRoom: "2 minutes 30 seconds",
      quillAndParchment: "5 minutes",
    },
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // dispatch invite to database so that it can be stored for later
    // POST_INVITE also posts to the story table
    dispatch({
      type: "POST_INVITE",
      payload: {
        invitedUser: invitedUser,
        storyTitle: newTitle,
        text_type: storyTextType,
        speed_type: storySpeedType,
      },
    });

    // finally, reroute user to the home page
    history.push("/home");
  };

  const handleCancel = () => {
    history.push("/home");
  };

  return (
    <Paper
      sx={{
        backgroundColor: theme.palette.primary.main,
        height: "auto",
        width: "350px",
        margin: "auto",
        marginTop: "100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "20px",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box>
          Invite
          <Select
            value={invitedUser}
            onChange={(e) => setInvitedUser(e.target.value)}
          >
            {allUsers.map((user) => (
              <MenuItem value={user} key={user.id}>
                {user.username}
              </MenuItem>
            ))}
          </Select>
          to a new story
        </Box>
        <InputLabel>Story Title (you can change this later):</InputLabel>
        <TextField
          sx={{ marginBottom: "10px" }}
          color="outline"
          type="text"
          label="Title"
          required
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />

        <InputLabel>Story Type</InputLabel>
        <Select
          value={storyTextType}
          onChange={(e) => setStoryTextType(e.target.value)}
        >
          <MenuItem value={"word by word"}>Word by Word</MenuItem>
          <MenuItem value={"sentence by sentence"}>
            Sentence by Sentence
          </MenuItem>
        </Select>

        <InputLabel>Story Speed</InputLabel>
        <Select
          value={storySpeedType}
          onChange={(e) => setStorySpeedType(e.target.value)}
        >
          <MenuItem value={"hypertype"}>
            Hypertype:{" "}
            {storyTextType == "word by word"
              ? timeControls.wordByWord.hypertype
              : timeControls.sentenceBySentence.hypertype}
          </MenuItem>
          <MenuItem value={"writer's room"}>
            Writer's Room:{" "}
            {storyTextType == "word by word"
              ? timeControls.wordByWord.writersRoom
              : timeControls.sentenceBySentence.writersRoom}
          </MenuItem>
          <MenuItem value={"quill and parchment"}>
            Quill and Parchment:{" "}
            {storyTextType == "word by word"
              ? timeControls.wordByWord.quillAndParchment
              : timeControls.sentenceBySentence.quillAndParchment}
          </MenuItem>
        </Select>

        <Button type="submit">CREATE INVITE</Button>
        <Button onClick={handleCancel}>CANCEL</Button>
      </form>
    </Paper>
  );
}

export default NewInvitation;
