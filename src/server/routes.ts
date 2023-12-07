import express, { Request, Response } from 'express';

export const router = express.Router();
import lambdaController from './controllers/lambdaController.js'
import {getLambdaLogs , addLambdaLog} from './controllers/dbController.js'
// Database routes, getting data

// test routes just to make sure they work when connected to FE. -JK
router.get('/getLogs', getLambdaLogs, (req: Request, res: Response): void => {
    // console.log('GET request to /api');
    res.status(200).send('hello');
});

router.post('/addLogs', addLambdaLog,(req: Request, res: Response):void => {
    res.locals.info = req.body;
    res.status(200).json(res.locals.info)
})

// Executing "step function workflow"
router.post("/executeLambdaWorkflow",  lambdaController.shear, ( req : Request, res:Response) : void =>{
    res.status(200).json(res.locals.output)
})





