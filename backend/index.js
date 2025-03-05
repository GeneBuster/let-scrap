const express = require("express");
const connectDB = require("./database/db");

require("dotenv").config();
const app = express();
connectDB(); // Connect to MongoDB

app.listen(5000, () => console.log("Server running on port 5000"));