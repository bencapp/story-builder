import React from "react";

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  return (
    <div className="container">
      <div>
        <p>
          StoryBuilder is a great app. Soon there will be more information here
          about how it works and how it was created.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
