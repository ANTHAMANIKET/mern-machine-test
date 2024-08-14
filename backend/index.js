// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Path to your db.js file

// Initialize Express app
const app = express();

// Define the port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
}));
app.use(express.json());

// Log MongoDB URI for debugging
console.log('Mongo URI:', process.env.MONGO_URI);

// Connect to MongoDB
connectDB();

// Define Routes
app.use('/api/employees', require('./routes/employeeRoutes'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
