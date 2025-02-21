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
    { id: 2, name: 'Rashmi', role: 'Designer' }
];


// Get All Users
app.get('/users', (req, res) => {
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

