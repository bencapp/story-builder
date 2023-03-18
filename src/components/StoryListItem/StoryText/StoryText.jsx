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
      {/* {JSON.stringify(text)} */}
      {text.map((text, i) => (
        <span key={i}>{text.text} </span>
      ))}
    </Box>
  );
}

export default StoryText;
