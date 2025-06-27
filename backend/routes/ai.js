const express = require('express');
console.log("Gemini Key:", process.env.GEMINI_API_KEY);
const router = express.Router();
const { GoogleGenerativeAI} = require('@google/generative-ai');
const auth = require('../middleware/auth');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Access denied: You do not have the required role' });
        }
        next();
    };
};

router.post('/chat', auth, authorize('student'), async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ msg: 'Prompt is required' });
    }

    try {
        const result = await model.generateContent([prompt]);
        
        const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
        res.json({ answer: text });
    } catch (err) {
        console.error('Gemini API Error:', err.message);
        // Provide a more user-friendly error message if the AI model fails
        res.status(500).json({ msg: 'Failed to get a response from the AI. Please try again.', error: err.message });
    }
});




module.exports = router;