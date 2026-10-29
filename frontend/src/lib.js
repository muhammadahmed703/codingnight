import axios from 'axios';
export const api=axios.create({baseURL:'/api'});
api.interceptors.request.use(c=>{const t=localStorage.getItem('hcm_token');if(t)c.headers.Authorization=`Bearer ${t}`;return c;});
export const money=n=>new Intl.NumberFormat('en-PK',{maximumFractionDigits:0}).format(Number(n||0));
export const fmtDate=d=>d?new Date(d).toLocaleDateString():'';
export const errorMessage=e=>e?.response?.data?.message||e.message||'Something went wrong';
