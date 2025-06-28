require('dotenv').config();
const express=require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const lectureRoutes = require('./routes/lectures');
const quizRoutes = require('./routes/quizzes');
const enrollmentRoutes = require('./routes/enrollments'); // NEW
const recommendationRoutes = require('./routes/recommendations'); 
const aiRoutes = require('./routes/ai');
const noteRoutes = require('./routes/noteRoutes');



const app= express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  'https://studyflow-ai.vercel.app', // your main production frontend
   'http://localhost:5173',
    'https://studyflow-pgs7ivn0d-soni-kumaris-projects-b205d6a9.vercel.app',
  'https://studyflow-ai-git-main-soni-kumaris-projects-b205d6a9.vercel.app',
  'http://localhost:3000' // dev
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
},
credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');
    } catch (err){
      console.error(err.message);
    
        process.exit(1);
    }
    
};
connectDB();

app.get('/', (req, res) => {
  res.send('StudyFlow-AI Backend API is Running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/quizzes', quizRoutes);


app.use('/api/enrollments', enrollmentRoutes); 

app.use('/api/recommendations', recommendationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notes', noteRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

