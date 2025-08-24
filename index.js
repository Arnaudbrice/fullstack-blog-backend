import express from "express";
import cors from "cors";
import postRouter from "./routers/postRouter.js";
import path from "path";
import fs from "fs";
import multer from "multer";
const app = express();

const uploadDir = path.join(process.cwd(), "public", "uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
}

// Storage configuration
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store files in the uploadDir
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // Setup the filename
  }
});

// File filter to allow specific image formats
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true); // Accept file
  } else {
    cb(null, false); // Reject file
  }
};
//express version greater than v4.16
/* sets up the middleware to parse incoming JSON data in the request body. This is necessary for handling POST, PUT, or PATCH requests that send JSON data */
app.use(express.json(), cors());
/*sets up the middleware to parse incoming URL-encoded data in the request body with the querystring library ( extended:false)*/
app.use(
  express.urlencoded({
    extended: false
  })
);

// Multer middleware for handling file uploads
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter
  }).single("cover")
); // 'cover' is the input field name

// Serve uploaded files
app.use("/uploads", express.static(uploadDir));

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
