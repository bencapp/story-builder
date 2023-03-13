import React from "react";
import LoginForm from "../LoginForm/LoginForm";
import { useHistory } from "react-router-dom";

import { Button, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function LoginPage() {
  const history = useHistory();
  const theme = useTheme();

  return (
    <Paper
      sx={{
        backgroundColor: theme.palette.primary.main,
        height: "auto",
        width: "350px",
        margin: "auto",
        marginTop: "100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "20px",
      }}
    >
      <h2>Login</h2>
      <LoginForm />

      <br></br>
      <p>First time?</p>
      <Button
        className="btn btn_asLink"
        onClick={() => {
          history.push("/registration");
        }}
      >
        Register
      </Button>
    </Paper>
  );
}

export default LoginPage;
