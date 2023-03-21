import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import {
  Button,
  Paper,
  FormControl,
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

  // local state for user being invited
  const [invitedUser, setInvitedUser] = useState(initialInvitedUser);

  // local state for story text type
  const [storyTextType, setStoryTextType] = useState("Word by Word");

  // story speed type
  const [storySpeedType, setStorySpeedType] = useState("Writer's Room");

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
        padding: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          width: "70%",
          margin: "auto",
        }}
      >
        <Box
          sx={{ textAlign: "center", fontWeight: "bold", marginBottom: "10px" }}
        >
          Invite a user to a new story
        </Box>
        <Box>User</Box>
        <Select
          value={invitedUser}
          onChange={(e) => setInvitedUser(e.target.value)}
          displayEmpty
        >
          {allUsers
            .filter((user) => user.id != currentUser.id)
            .map((user) => (
              <MenuItem value={user} key={user.id}>
                {user.username}
              </MenuItem>
            ))}
        </Select>

        <Box>Story Type</Box>
        <Select
          value={storyTextType}
          onChange={(e) => setStoryTextType(e.target.value)}
        >
          <MenuItem value={"Word by Word"}>Word by Word</MenuItem>
          <MenuItem value={"Sentence by Sentence"}>
            Sentence by Sentence
          </MenuItem>
        </Select>

        <Box>Story Speed</Box>
        <Select
          value={storySpeedType}
          onChange={(e) => setStorySpeedType(e.target.value)}
        >
          <MenuItem value={"Hypertype"}>
            Hypertype:{" "}
            {storyTextType == "Word by Word"
              ? timeControls.wordByWord.hypertype
              : timeControls.sentenceBySentence.hypertype}
          </MenuItem>
          <MenuItem value={"Writer's Room"}>
            Writer's Room:{" "}
            {storyTextType == "Word by Word"
              ? timeControls.wordByWord.writersRoom
              : timeControls.sentenceBySentence.writersRoom}
          </MenuItem>
          <MenuItem value={"Quill and Parchment"}>
            Quill and Parchment:{" "}
            {storyTextType == "Word by Word"
              ? timeControls.wordByWord.quillAndParchment
              : timeControls.sentenceBySentence.quillAndParchment}
          </MenuItem>
        </Select>

        <Box
          sx={{
            alignSelf: "center",
            display: "flex",
            gap: "5px",
            marginTop: "15px",
          }}
        >
          <Button color="warning" onClick={handleCancel}>
            CANCEL
          </Button>
          <Button color="success" onClick={handleSubmit}>
            CREATE INVITE
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default NewInvitation;
