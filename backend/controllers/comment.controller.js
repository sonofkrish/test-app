import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

export const getPostComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });

  res.json(comments);
};

export const addComment = async (req, res) => {
  const { userId: clerkUserId } = req.auth();
  const postId = req.params.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });

  const newComment = new Comment({
    ...req.body,
    user: user._id,
    post: postId,
  });

  const savedComment = await newComment.save();

  res.status(201).json(savedComment);
};

export const deleteComment = async (req, res) => {
  try {
    const auth = req.auth();
    const clerkUserId = auth.userId;
    const id = req.params.id;

    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    console.log("auth", auth);

    // ✅ Correct metadata path
    const role = auth.sessionClaims?.publicMetadata?.role || "user";

    console.log("auth sessionClaims", auth.sessionClaims);

    // ✅ Admin can delete any comment
    if (role === "admin") {
      await Comment.findByIdAndDelete(id);
      return res.status(200).json("Comment has been deleted");
    }

    // ✅ FIX: added await
    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json("User not found");
    }

    // ✅ Only delete own comment
    const deletedComment = await Comment.findOneAndDelete({
      _id: id,
      user: user._id,
    });

    if (!deletedComment) {
      return res.status(403).json("You can delete only your comment!");
    }

    res.status(200).json("Comment deleted");
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json("Server error");
  }
};