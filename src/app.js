const express = require('express');
const app = express();
const path = require('path');
const connectDB = require('./config/database');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Import routes
const routes = require('./routes/index');
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;