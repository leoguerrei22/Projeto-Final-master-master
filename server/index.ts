import routes from './src/routes';
import express, { NextFunction, Request, Response } from "express";
import { verifyToken } from './src/middleware/authenticate';


const app = express();

// Middlewares
app.use(express.json()); // for parsing application/json

//!!/ recomendação do gepeto de usar isso num middleware a parte para evitar confusão no caso do codigo aumentar

const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(`[${request.method}] => url:: ${request.url}`);

  next();
};

app.use(requestLogger);

app.use(verifyToken);
// Routes
app.use(routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});