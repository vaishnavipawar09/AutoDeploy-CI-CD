const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to handle JSON requests

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://vaishnavipawar09:Igotthejob@deploycluster.2ssx0.mongodb.net/?retryWrites=true&w=majority&appName=DeployCluster')
  .then(() => console.log('Connected to MongoDB 🚀'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
  
// Define User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true }
});

// Create Model
const User = mongoose.model('User', userSchema);
// Sample Data 
let users = [
    { id: 1, name: 'Vaishnavi Pawar', role: 'Developer' },
    { id: 2, name: 'Rashmi Bari', role: 'Designer' }
];

// Get All Users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetches all users from MongoDB
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Get a Single User by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

// Create a New User
app.post('/users', async (req, res) => {
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

// Update an Existing User
app.put('/users/:id', async (req, res) => {
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


// Delete a User
app.delete('/users/:id', (req, res) => {
    users = users.filter(u => u.id !== parseInt(req.params.id));
    res.json({ message: 'User deleted' });
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

// GET /tasks → Fetch all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// POST /tasks → Add a new task
app.post('/tasks', (req, res) => {
    const newTask = { id: tasks.length + 1, ...req.body };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

