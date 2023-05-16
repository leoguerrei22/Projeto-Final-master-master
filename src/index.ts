import express from 'express';
import routes from './routes';

const app = express();

// Middlewares
app.use(express.json()); // for parsing application/json

// Routes
app.use(routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});