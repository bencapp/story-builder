import { Box } from "@mui/system";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

function Timer({ myTimer }) {
  const [seconds, setSeconds] = useState(30);
  const myTurn = useSelector((store) => store.myTurn);
  const outOfTime = useSelector((store) => store.outOfTime);

  const dispatch = useDispatch();

  useEffect(() => {
    // for starting player, begin clock
    if ((myTurn && myTimer) || (!myTurn && !myTimer)) {
      let myInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        // if seconds is a 0
        else {
          clearInterval(myInterval);
          dispatch({ type: "SET_OUT_OF_TIME", payload: true });
        }
      }, 1000);
      return () => {
        clearInterval(myInterval);
      };
    }
  });

  return (
    <Box
      sx={{
        border: `3px solid ${myTimer ? "blue" : "red"}`,
        width: "125px",
        height: "50px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontSize: "35px",
      }}
    >
      0:{seconds >= 10 ? seconds : "0" + seconds}
    </Box>
  );
}

export default Timer;
