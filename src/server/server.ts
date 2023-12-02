import express from 'express'
import {router} from "./routes.js"
import path from "path"
import { fileURLToPath } from 'url';

const PORT = 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Importing main route file 
app.use("/api", router);


// Path to serve static assests
app.use(express.static(path.join(__dirname, '../../src/dist')));


app.listen(PORT, () => console.log('listening on PORT', PORT));