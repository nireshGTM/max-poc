import express from 'express';
import {verifyJwToken, validateStaff, validateProject, refreshJwToken} from '../middlewares/';
import adminController from '../controllers/admin/';
// import multer from 'multer';
// const upload = multer({ dest: "uploads/" });

const userRouter = express.Router();

userRouter.get('/dashboard', [verifyJwToken], (req,res) => {
    adminController.index(req,res);
})


//Admin
userRouter.get('/category/list', verifyJwToken, adminController.categoryList);
userRouter.get('/designation/list', verifyJwToken, adminController.designationList);

userRouter.get('/staff/list', verifyJwToken, adminController.engineerList);
userRouter.post('/staff/create', [verifyJwToken, validateStaff], adminController.engineerSave);
userRouter.get('/staff/:staffId', [verifyJwToken], adminController.getEngineer);
userRouter.put('/staff/:staffId', [verifyJwToken, validateStaff], adminController.engineerUpdate);
userRouter.delete('/staff/:staffId', verifyJwToken, adminController.engineerDestroy);

userRouter.get('/project/list', [], adminController.projectList);
userRouter.get('/project/:projectId', [], adminController.getProject);
userRouter.post('/project/create', [verifyJwToken, validateProject], adminController.projectSave);
userRouter.put('/project/:projectId', [verifyJwToken, validateProject], adminController.projectUpdate);
userRouter.delete('/project/:projectId', verifyJwToken, adminController.projectDestroy);

export default userRouter;