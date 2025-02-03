const express = require("express");
const dbConnect = require("./db/dbConnect");
require("dotenv").config();

const app = express();

app.use("/", (req, res) => {
  res.send("heelow user");
});

dbConnect()
  .then(() => {
    console.log("Database connected successful");
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT} `);
    });
  })
  .catch((err) => {
    console.log("ERROR: " + err);
  });
