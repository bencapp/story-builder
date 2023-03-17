import { Box } from "@mui/system";

function StoryText({ text }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        fontSize: "large",
      }}
    >
      {text.map((element) => (
        <span>{element} </span>
      ))}
    </Box>
  );
}

export default StoryText;
