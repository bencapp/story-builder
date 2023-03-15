import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import Timer from "./Timer/Timer";
import Story from "./Story/Story";
import TextForm from "./TextForm/TextForm";

import theme from "../Theme/Theme";

import { Grid, Box } from "@mui/material";

function WriteStory() {
  // current user
  const currentUser = useSelector((store) => store.user);

  // partner user
  // format is {id, username}
  const partnerUser = useSelector((store) => store.partnerUser);

  // local state variable for whose turn it is to write
  const [myTurn, setMyTurn] = useState();

  // socket room string
  //   const [room, setRoom] = useState();

  useEffect(() => {
    // TODO: on page load, randomly select a user
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
            <Story />
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

export default WriteStory;
