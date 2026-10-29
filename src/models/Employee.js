import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  employeeCode:{type:String,required:true,unique:true,uppercase:true}, firstName:{type:String,required:true}, lastName:{type:String,default:''}, email:{type:String,required:true,unique:true,lowercase:true},
  phone:String,address:String,gender:{type:String,enum:['male','female','other',''],default:''},department:{type:mongoose.Schema.Types.ObjectId,ref:'Department'},designation:{type:mongoose.Schema.Types.ObjectId,ref:'Designation'},
  joinDate:{type:Date,required:true},exitDate:Date,status:{type:String,enum:['active','probation','inactive','exited'],default:'active'}, basicSalary:{type:Number,required:true,min:1},
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
},{timestamps:true});
export default mongoose.models.Employee || mongoose.model('Employee',schema);
