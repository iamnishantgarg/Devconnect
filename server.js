const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");

//connect Database;
connectDB();

app.get("/", (req, res) => {
  return res.send("api running");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server is running on the port${PORT}`);
  }
});
