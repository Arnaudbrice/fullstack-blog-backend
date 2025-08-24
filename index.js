import express from "express";
import cors from "cors";
import postRouter from "./routers/postRouter.js";
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

app.get("/", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: "Database connected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/posts", postRouter);

const port = process.env.PORT || 3000;
/*starts the Express server and tells it to listen for incoming requests on a specific port. */
app.listen(port, () => {
  console.log(`Server is listening on port ${port}!`);
});
