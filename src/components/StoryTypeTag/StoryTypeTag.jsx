import { Box } from "@mui/system";
import { useTheme } from "@emotion/react";

function StoryTypeTag({ type, size }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor:
          type == "Word by Word"
            ? theme.palette.typeBackground.wordByWord
            : type == "Sentence by Sentence"
            ? theme.palette.typeBackground.sentenceBySentence
            : type == "Hypertype"
            ? theme.palette.typeBackground.hypertype
            : type == "Writer's Room"
            ? theme.palette.typeBackground.writersRoom
            : theme.palette.typeBackground.quillAndParchment,

        fontSize: size == "small" ? "12px" : "14px",
        padding: "4px 8px",
        borderRadius: "2px",
        textAlign: "center",
        display: "inline-block",
      }}
    >
      {type}
    </Box>
  );
}

export default StoryTypeTag;
