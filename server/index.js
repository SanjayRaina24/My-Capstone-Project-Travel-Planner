require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Used for serving static files
const tripRoutes = require('./routes/trips');

const app = express();
// Google App Engine requires the app to listen on process.env.PORT (which is 8080)
const PORT = process.env.PORT || 8080; 

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection (Your Cloud URL is hardcoded here, which is fine for deployment)
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// API Routes
app.use('/api/trips', tripRoutes);

// --- 🟢 THE FINAL FIX: CORRECT CATCH-ALL ROUTING 🟢 ---

// 1. Serve static files from the 'dist' folder
// We put this first to serve assets (like .js and .css) before the catch-all
app.use(express.static(path.join(__dirname, 'dist')));

// 2. Handle React Routing (For any GET request that didn't match an API route or a static file)
// We use path.resolve() here and app.get('*') which resolves the previous PathError conflict.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});
// ------------------------------------------------------

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
