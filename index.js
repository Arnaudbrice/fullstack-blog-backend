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
// Define a Post Model representing a table named Posts in the database
const Post = sequelize.define("Post", {
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

await Post.sync();

app.get("/", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: "Database connected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// GET /posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll();

    console.log("posts", posts);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /posts/:id
app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /posts
app.post("/posts", async (req, res) => {
  try {
    const { author, content, cover, date } = req.body;

    if (!author || !content || !cover || !date) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    const post = await Post.create({ author, content, cover, date });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /posts/:id

app.put("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { author, content, cover, date } = req.body;
    console.log("req.body", req.body);

    if (!author || !content || !cover || !date) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const [rowCount, updatedPosts] = await Post.update(
      { author, content, cover, date },
      { where: { id: id }, returning: true }
    );

    console.log("updatedPosts", updatedPosts);
    if (!rowCount) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    const updatedPost = updatedPosts[0];
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /posts/:id
app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const rowCount = await Post.destroy({ where: { id: id } });
    if (!rowCount) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.status(204).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}!`);
});
