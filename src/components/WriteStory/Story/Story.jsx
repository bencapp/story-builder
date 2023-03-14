import { Box } from "@mui/system";

import TextElement from "../TextElement/TextElement";

function Story({ story }) {
  return (
    <Box sx={{ fontSize: "30px" }}>
      {story.map((text, i) => (
        <TextElement key={i} text={text} myText={true} />
      ))}
    </Box>
  );
}

export default Story;
