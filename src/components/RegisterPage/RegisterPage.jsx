import React from "react";

import { useHistory } from "react-router-dom";
import RegisterForm from "../RegisterForm/RegisterForm";

import { Paper, Button, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function RegisterPage() {
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
