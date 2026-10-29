import mongoose from 'mongoose';
const schema=new mongoose.Schema({title:{type:String,required:true},body:{type:String,required:true},audience:{type:String,enum:['all','hr','employee'],default:'all'},postedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'}},{timestamps:true});
export default mongoose.models.Announcement || mongoose.model('Announcement',schema);
