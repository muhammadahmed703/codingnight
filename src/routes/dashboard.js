import { Router } from 'express';import {auth} from '../middleware/auth.js';import {asyncHandler} from '../utils/http.js';import {companyDashboard,employeeDashboard} from '../services/dashboardService.js';
const r=Router();r.use(auth);r.get('/',asyncHandler(async(req,res)=>res.json(req.user.role==='employee'?await employeeDashboard(req.user.employee):await companyDashboard())));export default r;
