import express, {Application} from 'express';
import {router} from '../server/routes';
const app:Application = express();

app.use(express.json())
app.use('/', router)
export default app;