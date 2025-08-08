const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// 🔁 Start cleanup cron job
require('./jobs/cleanup'); // 👈 Import this line to enable cleanup job

// Routes
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/blood', require('./routes/bloodRoutes'));

// Error middleware
app.use(require('./middleware/errorHandler'));

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
