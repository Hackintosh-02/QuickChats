const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const users = require('../models/User');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.insert(users).values({
            username,
            email,
            password: hashedPassword,
        });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error registering user' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.select(users).where(users.email.equals(email)).first();
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await db.select(users);
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

module.exports = { registerUser, loginUser, getAllUsers };
