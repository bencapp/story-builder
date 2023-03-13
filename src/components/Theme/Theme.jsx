import { createTheme } from "@mui/material/styles";

import PlayfairDisplay from "../fonts/PlayfairDisplay-Italic-VariableFont_wght.ttf";

const theme = createTheme({
  palette: {
    primary: {
      main: "#CCAA8B", // dark tan
    },
    secondary: {
      main: "#D9D9D9", // light grey
    },
    background: {
      main: "#E9E2D8", // light tan, more yellow
    },
    outline: {
      main: "#505050",
    },
    tonalOffset: 0.0,
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        variant: "contained",
      },
    },
  },
  typography: {
    fontFamily: "Playfair Display, serif",
  },
});

export default theme;
