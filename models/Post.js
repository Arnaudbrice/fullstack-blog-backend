import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";
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
export default Post;
