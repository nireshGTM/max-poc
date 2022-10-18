import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema(
    {
    //userId: { type: String, unique: true, required: true },
    role : {type: mongoose.Schema.Types.ObjectId, ref: "Role"},
    first_name : {type : String, default: null},
    last_name : { type: String, default: null },
    email : {type : String, unique: true, required : true, index : true},
    username : {type : String, unique: true, required : true, index : true},
    phone_number : { type: String, default: null },
    school : {type: mongoose.Schema.Types.ObjectId, ref: "School"},
    principal : {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
    email_verified_at : { type: Date, default: null },
    password: { type: String, default: null },
    status: { type: String, required: true },
    remeber_token : { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
    },
    {timestamps: true}
    );

export default mongoose.model('User',UserSchema);
