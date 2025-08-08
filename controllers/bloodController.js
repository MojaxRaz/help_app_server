const BloodRequest = require('../models/BloodRequest');
const { getIO } = require('../config/socket');

// @desc    Create a new blood request
// @route   POST /api/blood
exports.createBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.create({
      ...req.body,
      senderSocketId: req.body.senderSocketId, // 🔗 Save the sender's socket ID
    });

    // 🔴 Broadcast to all clients
    getIO().emit("new-blood-request", request);

    res.status(201).json(request);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ error: 'Failed to create blood request' });
  }
};

// @desc    Get all blood requests
// @route   GET /api/blood
exports.getBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ timestamp: -1 });
    res.json(requests);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: 'Failed to fetch blood requests' });
  }
};

// @desc    Update blood request status
// @route   PUT /api/blood/:id/status
exports.updateBloodRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // 🔁 Broadcast updated status
    getIO().emit("update-blood-request", request);

    res.json(request);
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ error: 'Failed to update status' });
  }
};
