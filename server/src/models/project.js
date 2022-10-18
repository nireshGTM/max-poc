import mongoose from 'mongoose';
const ProjectSchema = new mongoose.Schema(
    {
    project_name : {type : String, required : true},
    project_head : { type: mongoose.Schema.Types.ObjectId, ref: "Engineer", default: null, index : true },
    category : { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null, index : true },
    location : {type : String, required : true},
    start_date : {type : Date, default: null},
    due_date : {type : Date, default: null},
    blue_print : {type : String, default: null},
    design : {type : String, default: null},
    status : {type : String, required: true},
    description : {type : String, default: null}
    },
    {timestamps: true}
    );

export default mongoose.model('Project',ProjectSchema)