import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
import User from './user';
import Role from './role';
import Category from './category';
import Designation from './designation';
import Engineer from './engineer';
import Project from './project';
import InitialDataInsert from './initialData';

const db = { 
    User, 
    Role, 
    Category,
    Designation,
    Engineer, 
    Project
}


InitialDataInsert(db);

export default db;
