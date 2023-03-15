import { Box } from "@mui/system";
import { useSelector } from "react-redux";

import Timer from "./Timer/Timer";

function TimerContainer({ myTimer }) {
  const currentUser = useSelector((store) => store.user);
  const partnerUser = useSelector((store) => store.partnerUser);
  const myTurn = useSelector((store) => store.myTurn);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
      <Box
        sx={{
          padding: "5px",
          fontSize: "large",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box
          sx={
            (myTurn && myTimer) || (!myTurn && !myTimer)
              ? {
                  width: "15px",
                  height: "15px",
                  borderRadius: "100%",
                  backgroundColor: "rgb(44, 232, 44)",
                }
              : {
                  width: "15px",
                  height: "15px",
                  borderRadius: "100%",
                  backgroundColor: "transparent",
                }
          }
        ></Box>
        {myTimer ? currentUser.username : partnerUser.username}
      </Box>
      <Timer myTimer={myTimer} />
    </Box>
  );
}

export default TimerContainer;
