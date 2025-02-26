const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows JSON requests

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://vaishnavipawar09:Igotthejob@deploycluster.2ssx0.mongodb.net/?retryWrites=true&w=majority&appName=DeployCluster')
  .then(() => console.log('Connected to MongoDB! 🚀'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password for login
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Create User Model
const User = mongoose.model('User', userSchema);

// JWT Middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// User Signup
app.post('/auth/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Create new user
        user = new User({ name, email, password, role });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// User Login
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Users (Protected Route)
app.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a Single User by ID
app.get('/users/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a New User (Protected)
app.post('/users', authMiddleware, async (req, res) => {
    const { name, role } = req.body;
    
    if (!name || !role) {
        return res.status(400).json({ message: 'Name and role are required!' });
    }

    const newUser = new User({ name, role });

    try {
        const savedUser = await newUser.save(); // Saves user in MongoDB
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update an Existing User (Protected)
app.put('/users/:id', authMiddleware, async (req, res) => {
    try {
        const { name, role } = req.body;

        // Check if user exists before updating
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found. Check the ID and try again.' });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, role },
            { new: true, runValidators: true }
        );

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a User (Protected)
app.delete('/users/:id', authMiddleware, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Server Listening
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Sample tasks data
let tasks = [
    { id: 1, title: 'Learn Node.js', completed: false },
    { id: 2, title: 'Deploy app to Kubernetes', completed: true }
];

// GET /tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// POST /tasks 
app.post('/tasks', (req, res) => {
    const newTask = { id: tasks.length + 1, ...req.body };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

