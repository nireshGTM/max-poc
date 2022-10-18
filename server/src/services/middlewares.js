import morgan from 'morgan';
import cors from 'cors';

var allowlist = ['http://localhost:3000']
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;

    if (allowlist.indexOf(req.header('Origin')) !== -1 || !req.header.Origin) {
        corsOptions = { origin: true } 
    } else {
        callback(new Error('Not allowed by CORS'))
    }
    callback(null, corsOptions)
}

const middlewareService = (app) =>{
    //Middlewares
    app.use(morgan("dev"))
    app.use(cors(corsOptionsDelegate));
}

export default middlewareService;