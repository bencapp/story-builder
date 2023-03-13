import React from "react";

import { useHistory } from "react-router-dom";
import RegisterForm from "../RegisterForm/RegisterForm";

import { Paper, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function RegisterPage() {
  const history = useHistory();

  const theme = useTheme();

  return (
    <Paper
      sx={{
        backgroundColor: theme.palette.secondary.main,
        height: "400px",
        width: "350px",
        margin: "auto",
        marginTop: "100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>Register User</h2>

      <RegisterForm />
      <br></br>

      <p>Already a user?</p>
      <Button
        className="btn btn_asLink"
        onClick={() => {
          history.push("/login");
        }}
      >
        Login
      </Button>
    </Paper>
  );
}

export default RegisterPage;
