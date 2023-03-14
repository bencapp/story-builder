import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Timer from "./Timer/Timer";

import theme from "../Theme/Theme";

import { socket } from "../../socket";

import { Grid, Box } from "@mui/material";

function NewStory() {
  // current user
  const currentUser = useSelector((store) => store.user);

  const [partnerUser, setPartnerUser] = useState();

  // socket room string
  //   const [room, setRoom] = useState();

  // current value in form
  const [newText, setNewText] = useState("");

  // full story, store as an array
  const [story, setStory] = useState([]);

  useEffect(() => {
    // on page load, display a message telling a user that their invitation has been accepted. Add a button
    // to begin story
    socket.on("accept invite", (user1, user2) => {
      // determine who is the partner and who is the current user
      setPartnerUser(user1.id == currentUser.id ? user2 : user1);
      // set the local state room variable
      //   setRoom(room);
    });

    // update story when text is added
    socket.on("add text", (text) => {
      console.log("received text, text is", text);
      setStory((story) => [...story, text]);
    });
    // return socket.off("add text");
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("in handleSubmit");
    // check if text is a valid entry. for base mode, only single words are valid
    const regex = new RegExp("^[A-Za-z'\"]+$");
    if (regex.test(newText)) {
      console.log("sending new text:", newText);
      // add text to specified room
      socket.emit("add text", newText, "test-room");
      setNewText("");
    } else {
      console.log("invalid entry");
    }
  };

  return (
    <>
      <Box sx={{ marginLeft: "20px" }}>
        <h3>Create a New Story</h3>
      </Box>
      {!partnerUser ? (
        <p>Invite pending.</p>
      ) : (
        <Grid
          sx={{
            backgroundColor: theme.palette.primary.main,
            margin: "20px auto",
            padding: "20px",
            width: "95%",
            height: "85%",
          }}
          container
        >
          <Grid item xs={10}>
            <p>Starting new story with {partnerUser.username}</p>
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Write the next word!"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              ></input>
              <button type="submit">SUBMIT</button>
            </form>
            <p>
              {story.map((text, i) => (
                <span key={i}>{text} </span>
              ))}
            </p>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              alignSelf: "center",
              height: "70%",
            }}
            item
            xs={2}
          >
            <Timer />
            <Timer myTimer={true} />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default NewStory;
