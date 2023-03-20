import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import TimerContainer from "./TimerContainer/TimerContainer";
import Story from "./Story/Story";
import StartBox from "./StartBox/StartBox";

import theme from "../Theme/Theme";

import { Grid, Box } from "@mui/material";

import { socket } from "../../socket";

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

  // local state for whether anyone's time is out
  const [outOfTime, setOutOfTime] = useState(false);

  // local state for whether story has begun
  const [storyStarted, setStoryStarted] = useState(false);

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
      // when a player runs out of time, set local state variable
      if (userMilliseconds === 0) {
        setOutOfTime(true);
      }
    });
  }, [currentStoryID]);

  const startStory = () => {
    setStoryStarted(true);
  };

  return (
    <>
      <Box sx={{ marginLeft: "20px" }}>
        <h3>Create a New Story</h3>
      </Box>

      {!partnerUser ? (
        <p>
          There's no story being written! Invite someone to start one with you.
        </p>
      ) : !storyStarted ? (
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            margin: "20px auto",
            padding: "20px",
            width: "89%",
            height: "79%",
            display: "flex",
            placeContent: "center",
          }}
        >
          <Box sx={{ marginTop: "20%" }}>
            <StartBox startStory={startStory} />
          </Box>
        </Box>
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
          {/* This grid component displays the story */}
          <Grid item xs={10}>
            <Box sx={{ marginBottom: "10px" }}>
              Starting new story with {partnerUser.username}
            </Box>
            <Story myTurn={myTurn} outOfTime={outOfTime} />
          </Grid>
          {/* This grid component displays the timers*/}
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
            <TimerContainer time={partnerTime} />
            <TimerContainer myTimer={true} time={myTime} />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default WriteStory;
