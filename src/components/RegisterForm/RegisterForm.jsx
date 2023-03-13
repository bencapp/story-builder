import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, TextField } from "@mui/material";

import "../LoginForm/LoginForm.css";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: "REGISTER",
      payload: {
        username: username,
        password: password,
      },
    });
  }; // end registerUser

  return (
    <form className="login-register-form" onSubmit={registerUser}>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
        </h3>
      )}

      <TextField
        color="outline"
        type="text"
        label="Username"
        value={username}
        required
        onChange={(event) => setUsername(event.target.value)}
      />

      <TextField
        color="outline"
        type="password"
        label="Password"
        value={password}
        required
        onChange={(event) => setPassword(event.target.value)}
      />

      <Button type="submit">SUBMIT</Button>
    </form>
  );
}

export default RegisterForm;
