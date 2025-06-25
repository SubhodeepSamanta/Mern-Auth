import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../basic/dist')));

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../basic/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
