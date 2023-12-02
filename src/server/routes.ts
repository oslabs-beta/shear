import express, { Request, Response } from 'express';

export const router = express.Router();

// Database routes, getting data
router.get('/getLamdbaLogs',(req : Request , res:Response ):void =>{
    res.status(200).json(req.body)
})


// Executing "step function workflow"
router.get("/executeLambdaWorkflow", ( req : Request, res:Response) : void =>{
    res.status(200)
})





