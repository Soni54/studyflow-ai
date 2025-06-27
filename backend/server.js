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

app.use(cors());
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

