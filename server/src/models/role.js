import mongoose from 'mongoose';
const RoleSchema = new mongoose.Schema({
    name : String
})
export default mongoose.model('Role', RoleSchema);