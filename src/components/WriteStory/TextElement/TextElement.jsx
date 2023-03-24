import { Box } from "@mui/system";

// text is the text to display
// myText is a boolean, true if the current user wrote it,
// alse if the other user wrote it
function TextElement({ text, myText }) {
  return (
    <Box
      sx={{
        border: `1.5px ${myText ? "solid blue" : "dotted red"}`,
        padding: "4px",
        borderRadius: "2px",
      }}
    >
      {text}
    </Box>
  );
}

export default TextElement;
