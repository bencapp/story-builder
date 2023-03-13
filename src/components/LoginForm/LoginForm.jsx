import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { Button, TextField, Box } from "@mui/material";

import "./LoginForm.css";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: "LOGIN",
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch({ type: "LOGIN_INPUT_ERROR" });
    }
  }; // end login

  return (
    <>
      <form className="login-register-form" onSubmit={login}>
        <TextField
          sx={{ marginBottom: "10px" }}
          color="outline"
          type="text"
          label="Username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextField
          sx={{ marginBottom: "10px" }}
          color="outline"
          type="password"
          label="Password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button type="submit">LOG IN</Button>
      </form>
      {errors.loginMessage && (
        <Box
          sx={{ width: "80%", textAlign: "center" }}
          className="alert"
          role="alert"
        >
          <br></br>
          {errors.loginMessage}
        </Box>
      )}
    </>
  );
}

export default LoginForm;
