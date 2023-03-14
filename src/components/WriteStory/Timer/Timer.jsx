import { Box } from "@mui/system";

function Timer({ myTimer }) {
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
      1:04
    </Box>
  );
}

export default Timer;
