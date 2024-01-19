
import lambdaController from './controllers/lambdaController.js'
<<<<<<< HEAD
import {getLambdaLogs , addLambdaLog} from './controllers/dbController.js'
import express, { Request, Response } from 'express';
export const router = express.Router();
=======


>>>>>>> dev
// Database routes, getting data

// test routes just to make sure they work when connected to FE. -JK
router.post('/getLogs', getLambdaLogs, (req: Request, res: Response): void => {
    // console.log('GET request to /api');
    res.status(200).json(res.locals.output);
});
// router.post('/getLambdaLogs', (req: Request, res: Response): void => {
//     res.locals.info = req.body;
//     res.status(200).json(res.locals.info)
// })

//added a get method to make sure SSE are sent during functionality with the post request.


router.post('/getLambdaLogs', lambdaController.shear, (req: Request, res: Response): void => {

    res.status(200).json(res.locals.output)
})


<<<<<<< HEAD
// router.post('/addLogs', addLambdaLog,(req: Request, res: Response):void => {
//     res.locals.info = req.body;
//     res.status(200).json(res.locals.info)
// })

// Executing "step function workflow"
router.post("/executeLambdaWorkflow", lambdaController.shear, addLambdaLog, (req: Request, res: Response): void => {

=======
// Executing "step function workflow"
router.post("/executeLambdaWorkflow", lambdaController.shear, (req: Request, res: Response): void => {
    console.log(req.body)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
>>>>>>> dev
    res.status(200).json(res.locals.output)
 
})





