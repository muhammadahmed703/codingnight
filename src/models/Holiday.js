import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true},date:{type:Date,required:true,unique:true}},{timestamps:true});
export default mongoose.models.Holiday || mongoose.model('Holiday',schema);
