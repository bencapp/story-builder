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
  const currentStoryID = useSelector((store) => store.currentStoryID);

  // time remaining for each player, in milliseconds
  const [myTime, setMyTime] = useState();
  const [partnerTime, setPartnerTime] = useState();

  // local state variable for whose turn it is to write
  const myTurn = useSelector((store) => store.myTurn);
  // socket room string
  //   const [room, setRoom] = useState();

  useEffect(() => {
    dispatch({
      type: "FETCH_TURN",
      payload: {
        currentStoryID: currentStoryID,
        currentUserID: currentUser.id,
      },
    });

    // on time change, update the corresponding clock
    // if current user is not the user to update, userID will be null
    socket.on("update time", (userID, userMilliseconds) => {
      if (userID == currentUser.id) {
        setMyTime(userMilliseconds);
      } else {
        setPartnerTime(userMilliseconds);
      }
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
            {/* {!firstPlayerID ? <h3>Loading...</h3> : <Story myTurn={myTurn} />} */}
            <Story myTurn={myTurn} />
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
