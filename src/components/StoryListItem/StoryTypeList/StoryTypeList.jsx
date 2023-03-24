import { Box } from "@mui/system";
import StoryTypeTag from "../../StoryTypeTag/StoryTypeTag";

function StoryTypeList({ length_type, speed_type }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        width: "90%",
        height: "100%",
        alignItems: "end",
        marginTop: "10px",
      }}
    >
      <StoryTypeTag type={length_type} size={"small"} />
      <StoryTypeTag type={speed_type} size={"small"} />
    </Box>
  );
}

export default StoryTypeList;
