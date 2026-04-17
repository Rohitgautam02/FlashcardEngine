const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = new User({ email, password, name });
    await user.save();
    
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'your_super_secret_key');
    res.status(201).send({ user, token });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({ error: 'Email already exists' });
    }
    res.status(400).send(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'your_super_secret_key');
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
