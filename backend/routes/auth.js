const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/auth');
console.log('Middleware type:', typeof protect); // should be 'function'

router.post('/register', async (req,res) => {
    const { username, email, password, role} = req.body;

    try {
         let user = await User.findOne({email});
         if (user) {
            return res.status(400).json({msg: 'User with this email already exists'});

         } 
          user = await User.findOne({ username});
          if (user) {
            return res.status(400).json({msg: 'User with this username already exists'});

          }

       user = new User({
        username,
        email,
        password,
        role: (role || 'student').toLowerCase(),
       });

       const salt = await bcrypt.genSalt(10);
       user.password = await bcrypt.hash(password, salt);

       await user.save();

       const payload = {
        user: {
            id: user.id,
            role: user.role
        }
       };

       jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h'},
        (err, token) => {
            if (err) throw err;
            res.json({ token, msg: 'Registration successful!'});

        }
       );
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
    
});

router.post('/login', async (req, res) => {
    const { email, password} =req.body;
    try{
        let user= await User.findOne({ email});
        if (!user) {
            return res.status(400).json({msg: 'Invalid Credentials'});

        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({msg: 'Invalid Credentials'});
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h'},
            (err, token) => {
                if (err) throw err;
                res.json({ token, msg: 'Login successful!'});
            }
        );
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/profile', protect, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;