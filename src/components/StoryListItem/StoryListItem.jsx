import { Box } from "@mui/system";
import { Button, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useHistory } from "react-router-dom";

import UpvoteDownvote from "./UpvoteDownvote/UpvoteDownvote";
import StoryText from "./StoryText/StoryText";
import StoryTypeList from "./StoryTypeList/StoryTypeList";

function StoryListItem({ story, userVote }) {
  const theme = useTheme();
  const history = useHistory();

  return (
    <Box
      sx={{
        width: "100%",
        height: "125px",
        backgroundColor: theme.palette.secondary.main,
        boxShadow: "1",
      }}
    >
      <Box
        id="headline"
        sx={{
          height: "25px",
          backgroundColor: theme.palette.secondary.dark,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0px 5px",
        }}
      >
        <Box>{story.title}</Box>
        <Box>
          Contributors: {story.texts[0].username}, {story.texts[1].username}
        </Box>
      </Box>
      <Grid
        sx={{ position: "relative", zIndex: 10, height: "100px" }}
        container
        direction="row"
        overflow="true"
      >
        <Grid item xs={1}>
          <UpvoteDownvote story={story} userVote={userVote} />
        </Grid>
        <Grid sx={{ padding: "7px" }} item xs={7}>
          <StoryText text={story.texts} />
        </Grid>
        <Grid item xs={2}>
          <StoryTypeList />
        </Grid>
        <Grid sx={{ display: "flex", alignItems: "center" }} item xs={2}>
          <Button onClick={() => history.push(`/story/${story.id}`)}>
            VIEW FULL STORY
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StoryListItem;
