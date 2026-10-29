import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import setup from './routes/setup.js';
import auth from './routes/auth.js';
import organization from './routes/organization.js';
import users from './routes/users.js';
import employees from './routes/employees.js';
import attendance from './routes/attendance.js';
import leave from './routes/leave.js';
import payroll from './routes/payroll.js';
import dashboard from './routes/dashboard.js';
import comms from './routes/comms.js';
import ai from './routes/ai.js';
import { errorHandler } from './middleware/error.js';

const app=express();
app.use(helmet({contentSecurityPolicy:false}));
app.use(cors({origin:process.env.NODE_ENV==='production'?true:(process.env.FRONTEND_URL||'http://localhost:5173'),credentials:true}));
app.use(express.json({limit:'2mb'}));
app.use(morgan('dev'));
app.use(async (_req,_res,next)=>{try{await connectDB();next();}catch(e){next(e);}});
app.get('/api/health',(_req,res)=>res.json({ok:true,service:'hcm-lite'}));
app.use('/api/setup',setup);
app.use('/api/auth',auth);
app.use('/api/organization',organization);
app.use('/api/users',users);
app.use('/api/employees',employees);
app.use('/api/attendance',attendance);
app.use('/api/leave',leave);
app.use('/api/payroll',payroll);
app.use('/api/dashboard',dashboard);
app.use('/api/comms',comms);
app.use('/api/ai',ai);

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const dist=path.resolve(__dirname,'../frontend/dist');
if(process.env.NODE_ENV==='production'){
  app.use(express.static(dist));
  app.use((req,res,next)=>{ if(req.method==='GET' && !req.path.startsWith('/api/')) return res.sendFile(path.join(dist,'index.html')); next(); });
}
app.use(errorHandler);
export default app;
