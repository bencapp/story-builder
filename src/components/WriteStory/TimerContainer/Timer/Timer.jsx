import { Box } from "@mui/system";

function Timer({ myTimer, time }) {
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
      0:
      {time !== undefined
        ? time >= 10000
          ? Math.floor(time / 1000)
          : "0" + Math.floor(time / 1000)
        : 30}
    </Box>
  );
}

export default Timer;
