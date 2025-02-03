const dbConnect = require("./db/dbConnect");
require("dotenv").config();
const app = require('./app')


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
