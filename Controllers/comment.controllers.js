const db = require("../Database/config");
const Post = db.Post;
const Comment = db.Comment;

exports.createComment = async (req, res) => {
  try {
    const { postId, description } = req.body;
    const user = req.user;

    if (!user) {
      return res
        .status(404)
        .json({ message: "Cannot create comment. User not found" });
    }

    const post = await Post.findByPk(postId);

    if (!post) {
      return res
        .status(404)
        .json({ message: "Cannot create comment. Post not found" });
    }
    const comment = {
      description,
      postId,
    };

    switch (user.role) {
      case "user":
        comment.userId = user.id;
        break;
      case "doctor":
        comment.doctorId = user.id;
        break;
      case "pharmacist":
        comment.pharmacistId = user.id;
        break;
      default:
        return res
          .status(404)
          .json({ message: "User not found. comment cannotbe created" });
    }

    await Comment.create(comment);
    return res.status(201).json({ message: "Comment created successfully" });
  } catch (error) {
    console.warn(error);
    return res.status(500).json({ message: error.errors || error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json({ message: "Cannot delete post. User not found" });
    }
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Cannot delete comment. Comment not found." });
    }
    switch (user.role) {
      case "user":
        if (comment.userId !== user.id) {
          return res
            .status(403)
            .json({ message: "Unauthorized to delete comment." });
        }
        break;
      case "doctor":
        if (comment.doctorId !== user.id) {
          return res
            .status(403)
            .json({ message: "Unauthorized to delete comment." });
        }
        break;
      case "pharmacist":
        if (comment.pharmacistId !== user.id) {
          return res
            .status(403)
            .json({ message: "Unauthorized to delete comment." });
        }
        break;
      default:
        break;
    }

    await comment.destroy();
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { pid } = req.params;
    const post = await Post.findByPk(pid);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Cannot get comments. Post not found" });
    }

    const comments = await Comment.findAll({
      where: {
        postId: pid,
      },
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
    
    const transformedComments = comments.map((comment) => {
      let transformedComment = {
        id: comment.id,
        description: comment.description,
        createdAt: comment.createdAt,
        postId: comment.postId,
      };

      if (comment.user) transformedComment.user = comment.user;
      if (comment.doctor) transformedComment.doctor = comment.doctor;
      if (comment.pharmacist)
        transformedComment.pharmacist = comment.pharmacist;

      return transformedComment;
    });

    return res.status(200).json({ comments: transformedComments });
  } catch (error) {
    return res.status(500).json({ message: error.errors || error.message });
  }
};
