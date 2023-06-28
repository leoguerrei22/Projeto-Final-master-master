import routes from './routes';
import express, { NextFunction, Request, Response } from "express";
import { verifyToken } from './middleware/authenticate';
import cors from 'cors';

require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middlewares
app.use(express.json()); // for parsing application/json

const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction
) => {

  next();
};

app.use(requestLogger);

app.use(verifyToken);
// Routes
app.use(routes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
});
