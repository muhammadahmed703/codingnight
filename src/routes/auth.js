import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { asyncHandler, badRequest } from '../utils/http.js';
const r=Router();
const sign=u=>jwt.sign({sub:u._id,role:u.role},process.env.JWT_SECRET||'dev-secret-change-me',{expiresIn:process.env.JWT_EXPIRES_IN||'7d'});
r.post('/login',asyncHandler(async(req,res)=>{
  const u=await User.findOne({email:req.body.email?.toLowerCase()});
  if(!u||!u.active||!(await bcrypt.compare(req.body.password||'',u.passwordHash))) throw badRequest('Invalid email or password',401);
  u.lastLogin=new Date(); await u.save();
  res.json({token:sign(u),user:{id:u._id,name:u.name,email:u.email,role:u.role,employee:u.employee,mustChangePassword:u.mustChangePassword}});
}));
r.get('/me',auth,asyncHandler(async(req,res)=>res.json({user:req.user})));
r.post('/change-password',auth,asyncHandler(async(req,res)=>{
  const u=await User.findById(req.user._id); if(!(await bcrypt.compare(req.body.currentPassword||'',u.passwordHash))) throw badRequest('Current password is incorrect',422);
  if((req.body.newPassword||'').length<8) throw badRequest('New password must be at least 8 characters',422);
  u.passwordHash=await bcrypt.hash(req.body.newPassword,12); u.mustChangePassword=false; await u.save(); res.json({message:'Password changed'});
}));
export default r;
