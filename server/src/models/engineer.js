import mongoose from 'mongoose';
const EngineerSchema = new mongoose.Schema(
    {
        engineer_name : {type: String, required: true},
        phone_number : {type: String, default: null},
        email: { type : String, unique: true, required : true, index : true },
        designation : { type: mongoose.Schema.Types.ObjectId, ref: "Designation", default: null }
    },
    {timestamps: true}
    );
export default mongoose.model('Engineer',EngineerSchema)