import { createTheme } from "@mui/material/styles";

import PlayfairDisplay from "../fonts/PlayfairDisplay-Italic-VariableFont_wght.ttf";

const theme = createTheme({
  palette: {
    primary: {
      main: "#CCAA8B", // dark tan
    },
    secondary: {
      main: "#D1D1D1", // light grey
    },
    tertiary: {
      main: "#E9E2D8", // light tan, more yellow
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
    // MuiFilledInput: {
    //   root: {
    //     backgroundColor: "rgb(232, 241, 250)",
    //     "&:hover": {
    //       backgroundColor: "rgb(250, 232, 241)",
    //       // Reset on touch devices, it doesn't add specificity
    //       "@media (hover: none)": {
    //         backgroundColor: "rgb(232, 241, 250)",
    //       },
    //     },
    //     "&.Mui-focused": {
    //       backgroundColor: "rgb(250, 241, 232)",
    //     },
    //   },
    // },
  },
  typography: {
    fontFamily: "Playfair Display, serif",
  },
});

export default theme;
