import { Box } from "@mui/system";

function Timer({ myTimer, time }) {
  // time prop is delivered in milliseconds

  // function millisToMinutesAndSeconds(millis) {
  //   var minutes = Math.floor(millis / 60000);
  //   var seconds = ((millis % 60000) / 1000).toFixed(0);
  //   return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  // }

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
      {time !== undefined ? Math.floor(time / 60000) : 0}:
      {time !== undefined && Math.floor((time % 60000) / 1000) >= 10
        ? Math.floor((time % 60000) / 1000)
        : time !== undefined
        ? "0" + Math.floor((time % 60000) / 1000)
        : "00"}
    </Box>
  );
}

export default Timer;
