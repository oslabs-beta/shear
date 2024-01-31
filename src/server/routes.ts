import express, { Request, Response } from 'express';
export const router = express.Router();
import lambdaController from './controllers/lambdaController.js'
import {getLambdaLogs, addLambdaLog} from "./controllers/dbController.js"

router.get('/', (req: Request, res: Response): void => {
    // console.log('GET request to /api');
    res.status(200).send('hello');
});

router.post('/getLambdaLogs', lambdaController.shear, (req: Request, res: Response): void => {
    res.status(200).json(res.locals.output)
})

// Executing "step function workflow"
router.post("/executeLambdaWorkflow", lambdaController.shear, addLambdaLog, (req: Request, res: Response): void => {
    console.log(req.body)
    res.status(200).json(res.locals.output)
})





