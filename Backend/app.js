import express from 'express';
import morgan from 'morgan';
import connectDB from './db/db.js';
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use('/users', userRoutes);

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;