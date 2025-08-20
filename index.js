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

const sequelize = new Sequelize(process.env.PG_URI);
//id, author, content, cover, date
const Blog = sequelize.define("Blog", {
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cover: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
});

await Blog.sync();

app.get("/", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: "Database connected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// GET /blogs
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /blogs/:id
app.get("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /blogs
app.post("/blogs", async (req, res) => {
  try {
    const { author, content, cover, date } = req.body;

    if (!author || !content || !cover || !date) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    const blog = await Blog.create({ author, content, cover, date });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /blogs/:id

app.put("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { author, content, cover, date } = req.body;
    console.log("req.body", req.body);

    if (!author || !content || !cover || !date) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const [rowCount, updatedBlogs] = await Blog.update(
      { author, content, cover, date },
      { where: { id: id }, returning: true }
    );

    console.log("updatedBlogs", updatedBlogs);
    if (!rowCount) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    const updatedBlog = updatedBlogs[0];
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /blogs/:id
app.delete("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const rowCount = await Blog.destroy({ where: { id: id } });
    if (!rowCount) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    res.status(204).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}!`);
});
