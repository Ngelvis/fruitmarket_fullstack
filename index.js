const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Importing CORS
const cors = require('cors');
// Initialize CORS
app.use(cors());

// Importing dotenv file
require('dotenv').config();

// Importing the Product Router
const productRoute = require('./routes/product.route.js');
app.use(process.env.APP_PRODUCT_ROUTE_URL, productRoute);

// Importing the User Router
const userRoute = require('./routes/user.route.js');
app.use(process.env.APP_AUTH_ROUTE_URL, userRoute);

// Starting the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('MongoDB connection successful!');
}).catch((err) => {
    console.error('MongoDB connection error:', err.message);
});