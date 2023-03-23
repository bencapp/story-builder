import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import TimerContainer from "./TimerContainer/TimerContainer";
import Story from "./Story/Story";
import StartBox from "./StartBox/StartBox";
import StoryTypeTag from "../StoryTypeTag/StoryTypeTag";

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
  const currentStoryID = useSelector((store) => store.currentStoryID);

  // time remaining for each player, in milliseconds
  const [myTime, setMyTime] = useState();
  const [partnerTime, setPartnerTime] = useState();

  // local state for whether anyone's time is out
  const [outOfTime, setOutOfTime] = useState(false);

  // local state for who ran out of time
  const [outOfTimeUserID, setOutOfTimeUserID] = useState();

  // local state for whether story has begun
  const [storyStarted, setStoryStarted] = useState(false);

  // local state variable for whose turn it is to write
  const myTurn = useSelector((store) => store.myTurn);

  // story types
  const currentStoryTypes = useSelector((store) => store.currentStoryTypes);

  useEffect(() => {
    dispatch({
      type: "FETCH_TURN",
      payload: {
        currentStoryID: currentStoryID,
        currentUserID: currentUser.id,
      },
    });

    // on load, get the story types with the current story ID
    dispatch({ type: "FETCH_STORY_TYPES", payload: currentStoryID });

    // on load, server should send starting time in milliseconds based on current story types
    socket.on("starting milliseconds", (startingMilliseconds) => {
      setMyTime(startingMilliseconds);
      setPartnerTime(startingMilliseconds);
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

        if (userID == currentUser.id) {
          setOutOfTimeUserID(userID);
        } else {
          setOutOfTimeUserID(partnerUser.id);
        }
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
            borderRadius: "5px",
          }}
          container
        >
          {/* This grid component displays the story */}

          <Grid item xs={9}>
            {/* <Box sx={{ marginBottom: "10px" }}>
              Starting new story with <b>{partnerUser.username}</b>
            </Box> */}
            <Story
              myTurn={myTurn}
              outOfTime={outOfTime}
              outOfTimeUserID={outOfTimeUserID}
            />

            {/* box for displaying the story tags */}
          </Grid>
          <Grid item xs={1}></Grid>

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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <StoryTypeTag type={currentStoryTypes.speed_type} />
              <StoryTypeTag type={currentStoryTypes.length_type} />
            </Box>
            <TimerContainer myTimer={true} time={myTime} />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default WriteStory;
