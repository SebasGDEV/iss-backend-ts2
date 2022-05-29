import { Router } from 'express';
const tleController = require('../controllers/tlecontroller');

const usersRouter = Router();

usersRouter.get('/', (_, res) => {
  return res.send("OK");
});

usersRouter.get('/getISS',tleController.getISS);
usersRouter.get('/getISS161',tleController.getISS);
//usersRouter.get('/getTLE',tleController.getTLEs);

export default usersRouter;