import React from "react";

import { Box } from "@mui/system";

function AboutPage() {
  return (
    <div className="container">
      <Box sx={{ padding: "20px 30px", fontSize: "1.3em" }}>
        <p>
          <b>StoryBuilder</b> was created by <b>Ben Capp.</b> This was a two
          week solo development project.
        </p>
        <p>
          Thanks to all the instructors at Prime Digital Academy: Dane, Key,
          Edan, and Kris, as well as my Amethyst cohort for their support
          throughout this process!
        </p>
        <p>
          For more information, and to check out the code, you can visit the
          project's{" "}
          <a target="_blank" href="https://github.com/bencapp/story-builder">
            GitHub Repository.
          </a>
        </p>
      </Box>
    </div>
  );
}

export default AboutPage;
