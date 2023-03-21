import { Box } from "@mui/system";
import { Button } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { socket } from "../../../socket";

function StartBox({ startStory }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const partnerUser = useSelector((store) => store.partnerUser);
  const myTurn = useSelector((store) => store.myTurn);

  const currentStoryID = useSelector((store) => store.currentStoryID);

  // local state for whether both players are ready
  const [bothPlayersReady, setBothPlayersReady] = useState(false);

  // local state for countdown
  const [countdown, setCountdown] = useState(5);

  // local state for interval
  const [myInterval, setMyInterval] = useState();

  useEffect(() => {
    // both users receive this
    socket.on("ready to start story", () => {
      console.log("received ready to start story");
      setBothPlayersReady(true);

      setMyInterval(
        setInterval(() => {
          console.log("counting down:", countdown);
          setCountdown((countdown) => countdown - 1);
          if (countdown <= 0) {
            console.log("clearing interval");
            clearInterval(myInterval);
            startStory();
          }
        }, 1000)
      );
      return () => clearInterval(myInterval);
    });
  }, []);

  const handleAtZero = () => {
    startStory();
    clearInterval(myInterval);
    dispatch({ type: "SET_STORY_START_TIME", payload: currentStoryID });
  };

  return (
    <Box
      sx={{
        width: "300px",
        height: "auto",
        backgroundColor: bothPlayersReady
          ? theme.palette.success.main
          : theme.palette.secondary.main,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.3em",
        borderRadius: "10px",
        padding: "10px",
        gap: "10px",
        border: "1px solid black",
      }}
    >
      <Box>
        Starting story with <b>{partnerUser.username}</b>
      </Box>

      {/* If waiting */}
      {!bothPlayersReady ? (
        <>
          <Box>Waiting on partner...</Box>
        </>
      ) : (
        <>
          <Box>Partner ready!</Box>
          <Box>
            You go <b>{myTurn ? "first" : "second"}!</b> Starting in {countdown}
          </Box>
        </>
      )}
      {countdown == 0 && handleAtZero()}
    </Box>
  );
}

export default StartBox;
