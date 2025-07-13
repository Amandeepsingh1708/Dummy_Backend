const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../../models/login/User")

exports.signup = async (req, res) => {
    const { name, username, password, role } = req.body;

    try {
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            username,
            password: hashedPassword,
            role: role === 'user' ? 'user' : 'admin'  // 🛡️ default to user unless explicitly admin
        });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Exclude password from response
        const userData = {
            _id: user._id,
            name: user.name,
            username: user.username,
            role: user.role
        };

        res.status(201).json({ token, user: userData }); // ✅ Return full user object
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Signup failed' });
    }
};


exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Exclude password from response
        const userData = {
            _id: user._id,
            name: user.name,
            username: user.username,
            role: user.role
        };

        res.status(200).json({ token, user: userData }); // ✅ Return full user object
    } catch (err) {
        res.status(500).json({ message: 'Login failed' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

