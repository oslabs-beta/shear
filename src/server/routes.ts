import express, { Request, Response } from 'express';

export const router = express.Router();

// Database routes, getting data

//test routes just to make sure they work when connected to FE. -JK
router.get('/', (req: Request, res: Response): void => {
    // console.log('GET request to /api');
    res.status(200).send('hello');
});
router.post('/getLambdaLogs',(req: Request, res: Response):void => {
    res.locals.info = req.body;
    res.status(200).json(res.locals.info)
})



// Executing "step function workflow"
router.get("/executeLambdaWorkflow", ( req : Request, res:Response) : void =>{
    res.status(200);
})





