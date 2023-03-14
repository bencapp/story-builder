import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import { Button, Paper, TextField, Select, MenuItem } from "@mui/material";
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

  const handleSubmit = (event) => {
    event.preventDefault();
    // dispatch invite to database so that it can be stored for later

    // POST_INVITE also posts to the story table
    dispatch({
      type: "POST_INVITE",
      payload: { invitedUser: invitedUser, storyTitle: newTitle },
    });

    // also immediately push invite via socket
    socket.emit("private invite", currentUser, invitedUser);

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
      <h2>
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
      </h2>
      <form onSubmit={handleSubmit}>
        <span>Story Title (you can change this later):</span>
        <TextField
          sx={{ marginBottom: "10px" }}
          color="outline"
          type="text"
          label="Title"
          required
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />

        <Button type="submit">CREATE INVITE</Button>
        <Button onClick={handleCancel}>CANCEL</Button>
      </form>
    </Paper>
  );
}

export default NewInvitation;
