import { Box } from "@mui/system";

// text is the text to display
// myText is a boolean, true if the current user wrote it,
// alse if the other user wrote it
function TextElement({ text, myText }) {
  return (
    <Box
      sx={{
        border: `2px ${myText ? "solid blue" : "dotted red"}`,
        padding: "2px",
      }}
    >
      {text}
    </Box>
  );
}

export default TextElement;
