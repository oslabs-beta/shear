import express from 'express';
export const router = express.Router();
import lambdaController from './controllers/lambdaController.ts';
// Database routes, getting data
//test routes just to make sure they work when connected to FE. -JK
router.get('/', (req, res) => {
    // console.log('GET request to /api');
    res.status(200).send('hello');
});
// router.post('/getLambdaLogs', (req: Request, res: Response): void => {
//     res.locals.info = req.body;
//     res.status(200).json(res.locals.info)
// })
router.post('/getLambdaLogs', lambdaController.shear, (req, res) => {
    res.status(200).json(res.locals.output);
});
// Executing "step function workflow"
router.post("/executeLambdaWorkflow", lambdaController.shear, (req, res) => {
    res.status(200).json(res.locals.output);
});
//# sourceMappingURL=routes.js.map