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
          padding: "1px 6px",
        }}
      >
        <Box>{story.title}</Box>
        <Box>
          Contributors: {story.texts[0].username}, {story.texts[1].username}
        </Box>
      </Box>
      <Grid
        sx={{
          position: "relative",
          zIndex: 10,
          height: "100px",
          paddingRight: "10px",
        }}
        columns={30}
        container
        direction="row"
      >
        <Grid item xs={2}>
          <UpvoteDownvote story={story} userVote={userVote} />
        </Grid>
        <Grid
          sx={{ padding: "7px", overflow: "hidden", height: "100px" }}
          item
          xs={20}
        >
          <StoryText text={story.texts} />
        </Grid>
        <Grid item xs={5}>
          <StoryTypeList
            length_type={story.length_type}
            speed_type={story.speed_type}
          />
        </Grid>
        <Grid sx={{ display: "flex", alignItems: "center" }} item xs={3}>
          <Button
            color="button"
            onClick={() => history.push(`/story/${story.id}`)}
          >
            FULL STORY
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StoryListItem;
