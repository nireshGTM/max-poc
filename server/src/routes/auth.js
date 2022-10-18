import express from 'express';
import {verifyAuth} from '../middlewares/';
import authController from '../controllers/auth/authController';

const authRouter = express.Router();

//GET Requests

authRouter.post("/api_login",[],authController.apiLogin);
authRouter.post("/refresh_token",[],authController.refreshToken);


export default authRouter;
