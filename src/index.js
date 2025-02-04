const dbConnect = require("./db/dbConnect");
const app = require('./app')
require("dotenv").config({path:'./.env'});


dbConnect()
  .then(() => {
    console.log("Database connected successful");
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`⚙️ server is running on http://localhost:${PORT} `);
    });
  })
  .catch((err) => {
    console.log("ERROR: " + err);
  });
