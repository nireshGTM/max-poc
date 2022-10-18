import mongoose from 'mongoose';
const DesignationSchema = new mongoose.Schema(
    {
    name : {type : String, required : true}
    },
    {timestamps: true}
    );
export default mongoose.model('Designation',DesignationSchema)