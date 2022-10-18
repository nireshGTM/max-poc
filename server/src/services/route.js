import {readdirSync} from 'fs';
import authRouter from '../routes/auth';
import userRouter from '../routes/user';

const path = __dirname;
// const routeService = (app) =>{
//     //Routes Middlewares auto loads
//     readdirSync(path+"/../routes").map((route) => {
//         app.use('/', require('../routes/'+route));
//     });
// }

const routeService = (app) =>{
    app.use('/', authRouter);
    app.use('/', userRouter);
}

export default routeService;
