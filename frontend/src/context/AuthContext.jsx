import {createContext,useContext,useEffect,useState} from 'react';import {api} from '../lib';
const C=createContext();export const useAuth=()=>useContext(C);
export function AuthProvider({children}){const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('hcm_user')||'null'));const [loading,setLoading]=useState(false);
const login=async(email,password)=>{setLoading(true);try{const {data}=await api.post('/auth/login',{email,password});localStorage.setItem('hcm_token',data.token);localStorage.setItem('hcm_user',JSON.stringify(data.user));setUser(data.user);return data.user;}finally{setLoading(false)}};
const logout=()=>{localStorage.removeItem('hcm_token');localStorage.removeItem('hcm_user');setUser(null)};
useEffect(()=>{if(user&&localStorage.getItem('hcm_token'))api.get('/auth/me').then(({data})=>{const u={...data.user,id:data.user._id};localStorage.setItem('hcm_user',JSON.stringify(u));setUser(u)}).catch(logout)},[]);
return <C.Provider value={{user,login,logout,loading,setUser}}>{children}</C.Provider>}
