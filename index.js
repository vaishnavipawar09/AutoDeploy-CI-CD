const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to handle JSON requests

// Sample Data (Later, we'll move this to a database)
let users = [
    { id: 1, name: 'Vaishnavi', role: 'Developer' },
    { id: 2, name: 'John Doe', role: 'Designer' }
];

// ✅ API Endpoints

// 1️⃣ Get All Users
app.get('/users', (req, res) => {
    res.json(users);
});

// 2️⃣ Get a Single User by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

// 3️⃣ Create a New User
app.post('/users', (req, res) => {
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

// 4️⃣ Update an Existing User
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });

    Object.assign(user, req.body);
    res.json(user);
});

// 5️⃣ Delete a User
app.delete('/users/:id', (req, res) => {
    users = users.filter(u => u.id !== parseInt(req.params.id));
    res.json({ message: 'User deleted' });
});

// Server Listening
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

//
