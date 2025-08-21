import Post from "../models/Post.js";
// GET /posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();

    console.log("posts", posts);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /posts/:id
export const getPostById = async (req, res) => {
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
};

// POST /posts
export const createPost = async (req, res) => {
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
};

// PUT /posts/:id

export const updatePost = async (req, res) => {
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
};

// DELETE /posts/:id
export const deletePost = async (req, res) => {
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
};
