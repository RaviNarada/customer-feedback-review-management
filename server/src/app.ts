import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import studentReviewRoutes from './routes/studentReview.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🚀 Backend Server is Live and Healthy!');
});

app.use('/api/student-review', studentReviewRoutes);

export default app;