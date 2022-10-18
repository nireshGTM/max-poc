import middlewareService from './middlewares';
import dbService from './db';
import routeService from './route';

const initServices = (app)=>{
    middlewareService(app);
    routeService(app);
    dbService();
}

export default initServices;