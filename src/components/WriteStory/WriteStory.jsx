import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Timer from "./Timer/Timer";
import Story from "./Story/Story";
import TextForm from "./TextForm/TextForm";

import theme from "../Theme/Theme";

import { socket } from "../../socket";

import { Grid, Box } from "@mui/material";

function NewStory() {
  // current user
  const currentUser = useSelector((store) => store.user);

  const [partnerUser, setPartnerUser] = useState();

  // socket room string
  //   const [room, setRoom] = useState();

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
            <b>Starting new story with {partnerUser.username}</b>
            <Story story={story} />
            <TextForm />
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
