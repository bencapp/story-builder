const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const pool = require("../modules/pool");

const router = express.Router();

// NOTE: the POST functionality for the story table is in the invite.router.js POST

module.exports = router;
