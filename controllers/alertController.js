const asyncHandler = require("express-async-handler");
const Alert = require("../models/Alert");
const { getIO } = require("../config/socket");

// @desc    Create a new emergency alert
// @route   POST /api/alerts
// @access  Public
exports.createAlert = asyncHandler(async (req, res) => {
  const { type, description, location, senderSocketId } = req.body;

  if (!type || !location) {
    res.status(400);
    throw new Error("Type and location are required");
  }

  const alert = await Alert.create({ type, description, location });

  const io = getIO();

  // Broadcast alert to all connected clients except the sender
  for (let [id, socket] of io.sockets.sockets) {
    if (id !== senderSocketId) {
      socket.emit("new-alert", alert);
    }
  }

  res.status(201).json(alert);
});

// @desc    Fetch all alerts
// @route   GET /api/alerts
// @access  Public
exports.getAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alert.find().sort({ createdAt: -1 });
  res.json(alerts);
});

// @desc    Resolve an alert manually
// @route   POST /api/alerts/:id/resolve
// @access  Public
exports.resolveAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    res.status(404);
    throw new Error("Alert not found");
  }

  alert.status = "resolved";
  await alert.save();

  res.json({ message: "Alert resolved", alert });
});

// @desc    Add a comment to an alert
// @route   POST /api/alerts/:id/comment
// @access  Public
exports.addComment = asyncHandler(async (req, res) => {
  const { text, user = "Anonymous" } = req.body;
  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    res.status(404);
    throw new Error("Alert not found");
  }

  alert.comments.push({ user, text });
  await alert.save();

  res.json({ message: "Comment added", alert });
});

// @desc    Upvote or downvote an alert
// @route   POST /api/alerts/:id/vote
// @access  Public
exports.voteAlert = asyncHandler(async (req, res) => {
  const { id, vote } = req.params;

  const alert = await Alert.findById(id);

  if (!alert) {
    res.status(404);
    throw new Error("Alert not found");
  }

  if (vote === "up") {
    alert.upvotes += 1;
  } else if (vote === "down") {
    alert.downvotes += 1;
  } else {
    res.status(400);
    throw new Error("Invalid vote type");
  }

  await alert.save();

  res.json({ message: "Vote registered", alert });
});
