const userModel = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Creating SignIn Logic
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = { userId: user._id };

    // Encrypting the access token
    const token = jwt.sign(payload, process.env.APP_SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({
      message: "Login Successful",
      token
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Creating SignUp Logic
const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check for required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "Send all required fields"
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered"
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    const userRegData = await user.save();
    res.status(201).json({
      message: "Registration successful",
      userRegData
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Creating Specific user dashboard
const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized User" });
  }

  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET_KEY);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  signIn,
  signUp,
  verifyJWT
};