const express = require("express");
const router = express.Router();
const {
  createAlert,
  getAlerts,
  resolveAlert,
  addComment,
  voteAlert,
} = require("../controllers/alertController");

router.post("/", createAlert);
router.get("/", getAlerts);
router.put("/:id/resolve", resolveAlert);
router.post("/:id/comment", addComment);
router.post("/:id/:vote", voteAlert);

module.exports = router;
