import { createTheme } from "@mui/material/styles";

import PlayfairDisplay from "../fonts/PlayfairDisplay-Italic-VariableFont_wght.ttf";

const theme = createTheme({
  palette: {
    primary: {
      main: "#CCAA8B", // dark tan
    },
    secondary: {
      main: "#D1D1D1", // light grey
      dark: "#b7b6b6",
    },
    tertiary: {
      main: "#E9E2D8", // light tan, more yellow
    },
    warning: {
      main: "#ff2525",
    },
    success: {
      main: "#48f477",
    },
    invite: {
      main: "#fe8e6d",
    },
    typeBackground: {
      hypertype: "#6feb45",
      writersRoom: "#8cf0f0",
      quillAndParchment: "#c086ff",
      wordByWord: "#ff6b65",
      sentenceBySentence: "#ffa831",
    },
    outline: {
      main: "#000000",
    },
    tonalOffset: 0.0,
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "tertiary",
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        variant: "contained",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#E9E2D8",
        },
      },
    },
  },

  typography: {
    fontFamily: "Playfair Display, serif",
  },
});

export default theme;
