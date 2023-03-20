import { Box } from "@mui/system";
import { Button } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";

function StartBox() {
  const theme = useTheme();
  const partnerUser = useSelector((store) => store.partnerUser);
  const myTurn = useSelector((store) => store.myTurn);

  return (
    <Box
      sx={{
        width: "300px",
        height: "200px",
        backgroundColor: theme.palette.secondary.main,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <Box>Starting story with {partnerUser.username}</Box>
      <Box>You go {myTurn ? "first" : "second"}!</Box>
      {/* If waiting */}
      <Box>Waiting on partner...</Box>
      <Button>START</Button>
    </Box>
  );
}

export default StartBox;
