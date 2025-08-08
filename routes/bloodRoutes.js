const express = require('express');
const {
  createBloodRequest,
  getBloodRequests,
  updateBloodRequestStatus,
} = require('../controllers/bloodController');

const router = express.Router();

router.post('/', createBloodRequest);
router.get('/', getBloodRequests);
router.put('/:id', updateBloodRequestStatus);

module.exports = router;
