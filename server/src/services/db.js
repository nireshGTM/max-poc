import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import db from '../models';

dotenv.config();

// DB connect and initialize
const mongooseService = ()=>{
    mongoose.connect(`mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });
}

export default mongooseService;