import bcrypt from 'bcryptjs';
import Company from '../models/Company.js';
import User from '../models/User.js';
import LeaveType from '../models/LeaveType.js';

export async function ensureDefaultLeaveTypes(){
  const count=await LeaveType.countDocuments();
  if(!count){
    await LeaveType.insertMany([
      {name:'Annual',code:'ANNUAL',annualQuota:14,paid:true},
      {name:'Sick',code:'SICK',annualQuota:8,paid:true},
      {name:'Casual',code:'CASUAL',annualQuota:10,paid:true},
      {name:'Unpaid',code:'UNPAID',annualQuota:0,paid:false,unlimited:true}
    ]);
  }
}

export async function ensureEnvAdmin(){
  const email=process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password=process.env.ADMIN_PASSWORD;
  if(!email||!password) return;
  if(await User.countDocuments()) return;
  if(!(await Company.countDocuments())) await Company.create({name:'HCM Lite Company'});
  const passwordHash=await bcrypt.hash(password,12);
  await User.create({name:'Administrator',email,passwordHash,role:'admin'});
  await ensureDefaultLeaveTypes();
}
