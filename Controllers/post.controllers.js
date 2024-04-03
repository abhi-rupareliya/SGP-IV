const path = require("path");
const fs = require("fs");
const db = require("../Database/config");
const Post = db.Post;

// Create and Save a new Post
exports.createPost = async (req, res) => {
  const { title, description } = req.body;
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json({ message: "Cannot create post. User not found" });
    }

    const post = {
      title,
      description,
      image: req.fileUrl.post_image,
    };
    switch (user.role) {
      case "user":
        post.userId = user.id;
        break;
      case "doctor":
        post.doctorId = user.id;
        break;
      case "pharmacist":
        post.pharmacistId = user.id;
        break;
      default:
        return res
          .status(404)
          .json({ message: "User not found. post cannotbe created" });
    }

    await Post.create(post);
    return res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "fullName", "email", "mobileNumber", "user_photo"],
        },
        {
          model: db.Doctor,
          as: "doctor",
          attributes: [
            "id",
            "fullName",
            "email",
            "mobileNumber",
            "doctor_photo",
          ],
        },
        {
          model: db.Pharmacist,
          as: "pharmacist",
          attributes: [
            "id",
            "fullName",
            "email",
            "mobileNumber",
            "pharmacist_photo",
          ],
        },
      ],
    });

    // Transform posts to avoid null fields in response
    const transformedPosts = posts.map((post) => {
      const transformedPost = {
        id: post.id,
        title: post.title,
        description: post.description,
        image: post.image,
      };
      // Add user information if present
      if (post.user) {
        transformedPost.user = post.user;
      } else if (post.doctor) {
        transformedPost.doctor = post.doctor;
      } else if (post.pharmacist) {
        transformedPost.pharmacist = post.pharmacist;
      }
      return transformedPost;
    });

    return res.status(200).json({ posts: transformedPosts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.errors || error.message });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json({ message: "Cannot delete post. User not found" });
    }
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Cannot delete post. Post not found." });
    }
    switch (user.role) {
      case "user":
        if (post.userId !== user.id) {
          return res
            .status(403)
            .json({ message: "Unauthorized to delete post." });
        }
        break;
      case "doctor":
        if (post.doctorId !== user.id) {
          return res
            .status(403)
            .json({ message: "Unauthorized to delete post." });
        }
        break;
      case "pharmacist":
        if (post.pharmacistId !== user.id) {
          return res
            .status(403)
            .json({ message: "Unauthorized to delete post." });
        }
        break;
      default:
        break;
    }

    if (post.image) {
      const f_path = path.resolve(
        __dirname,
        "..",
        "uploads",
        "post_images",
        path.basename(post.image)
      );

      fs.unlink(f_path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting old file: ", unlinkError.message);
        }
      });
    }

    await post.destroy();
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const image = req.fileUrl.post_image;
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is authorized to update the post
    switch (user.role) {
      case "user":
        if (post.userId !== user.id) {
          return res
            .status(403)
            .json({ message: "Unauthorized to update this post" });
        }
        break;
      case "doctor":
        if (post.doctorId !== user.id) {
          return res
            .status(403)
            .json({ message: "Unauthorized to update this post" });
        }
        break;
      case "pharmacist":
        if (post.pharmacistId !== user.id) {
          return res
            .status(403)
            .json({ message: "Unauthorized to update this post" });
        }
        break;
      default:
        return res.status(404).json({ message: "User not found" });
    }
    if (image && post.image) {
      const f_path = path.resolve(
        __dirname,
        "..",
        "uploads",
        "post_images",
        path.basename(post.image)
      );

      fs.unlink(f_path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting old file: ", unlinkError.message);
        }
      });
    }

    if (title) {
      post.title = title;
    }
    if (description) {
      post.description = description;
    }
    if (image) {
      post.image = image;
    }

    await post.save();
    return res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "fullName", "email", "mobileNumber", "user_photo"],
        },
        {
          model: db.Doctor,
          as: "doctor",
          attributes: [
            "id",
            "fullName",
            "email",
            "mobileNumber",
            "doctor_photo",
          ],
        },
        {
          model: db.Pharmacist,
          as: "pharmacist",
          attributes: [
            "id",
            "fullName",
            "email",
            "mobileNumber",
            "pharmacist_photo",
          ],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const transformedPost = {
      id: post.id,
      title: post.title,
      description: post.description,
      image: post.image,
    };
    if (post.user) {
      transformedPost.user = post.user;
    } else if (post.doctor) {
      transformedPost.doctor = post.doctor;
    } else if (post.pharmacist) {
      transformedPost.pharmacist = post.pharmacist;
    }

    return res.status(200).json(transformedPost);
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};
