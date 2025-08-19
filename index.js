import express from "express";
import cors from "cors";
import { Sequelize, DataTypes } from "sequelize";
import path from "path";
const app = express();

//express version greater than v4.16
/* sets up the middleware to parse incoming JSON data in the request body. This is necessary for handling POST, PUT, or PATCH requests that send JSON data */
app.use(express.json(), cors());
/*sets up the middleware to parse incoming URL-encoded data in the request body with the querystring library ( extended:false)*/
app.use(
  express.urlencoded({
    extended: false
  })
);

// Serve static files from the public folder
app.use(express.static(path.join(import.meta.dirname, "public")));
app.get("/", (req, res) => {
  res.send("Hello World!");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port port!`);
});
