import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import TimerContainer from "./TimerContainer/TimerContainer";
import Story from "./Story/Story";
import TextForm from "./TextForm/TextForm";

import theme from "../Theme/Theme";

import { Grid, Box } from "@mui/material";

function WriteStory() {
  // current user
  const currentUser = useSelector((store) => store.user);
  const dispatch = useDispatch();

  // partner user
  // format is {id, username}
  const partnerUser = useSelector((store) => store.partnerUser);
  const firstPlayerID = useSelector((store) => store.firstPlayerID);

  // local state variable for whose turn it is to write
  const myTurn = useSelector((store) => store.myTurn);
  // socket room string
  //   const [room, setRoom] = useState();

  useEffect(() => {
    // check if firstPlayerID has been set. if not, set it to partner user
    // (firstPlayerID is set in story POST, which happens on the invite recipient's client)
    if (!firstPlayerID) {
      console.log(
        "setting first player ID to opponent, partnerUser.id is",
        partnerUser.id
      );
      const partnerUserID = partnerUser.id ? partnerUser.id : null;
      dispatch({ type: "SET_FIRST_PLAYER_ID", payload: partnerUserID });
    }

    // On page load, set myTurn based on value of firstPlayer
    // if my partner is the first player, I am not
    console.log(
      "partner user is",
      partnerUser.inviteSide,
      "firstPlayer is",
      firstPlayerID
    );
    // for now, set recipient to the first player

    dispatch({
      type: "SET_MY_TURN",
      payload: partnerUser.inviteSide == "sender",
    });
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
            <Box sx={{ marginBottom: "10px" }}>
              Starting new story with {partnerUser.username}
            </Box>
            {/* wait for story post to complete before starting */}
            {!firstPlayerID ? <h3>Loading...</h3> : <Story myTurn={myTurn} />}
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
            <TimerContainer />
            <TimerContainer myTimer={true} />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default WriteStory;
