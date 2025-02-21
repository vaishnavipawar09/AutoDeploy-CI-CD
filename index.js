const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to handle JSON requests

// Sample Data 
let users = [
    { id: 1, name: 'Vaishnavi Pawar', role: 'Developer' },
    { id: 2, name: 'Rashmi Bari', role: 'Designer' }
];


// Get All Users
app.get('/users', (req, res) => {
    const role = req.query.role; // Gets the "role" from query params
    if (role) {
        const filteredUsers = users.filter(u => u.role === role);
        return res.json(filteredUsers);
    }
    res.json(users);
});

// Get a Single User by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

// Create a New User
app.post('/users', (req, res) => {
    const { name, role } = req.body;

    // Simple validation
    if (!name || !role) {
        return res.status(400).json({ message: 'Name and role are required!' });
    }

    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Update an Existing User
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });

    Object.assign(user, req.body);
    res.json(user);
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

