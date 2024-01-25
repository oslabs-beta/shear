import express, { Request, Response, NextFunction } from 'express'
import {router} from "./routes.js"
import path from "path"
import { fileURLToPath } from 'url';
import CustomError from './types.js';

const PORT = 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//this allows cors because frontend vite port is at 5173 and backend server is at port 3000; - JK
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

// Importing main route file 
app.use("/api", router);




// Path to serve static assests
app.use(express.static(path.join(__dirname, '../../dist')));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: CustomError, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'An unexpected middleware error occurred. ',
      status,
      requestDetails: err.requestDetails || {}, 
    },
  });
});


app.listen(PORT, () => console.log('CONNECTED: listening on PORT', PORT));