import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login/', credentials);
      localStorage.setItem('token', res.data.token); // Token save kar rahe hain
      alert("Access Granted!");
      navigate('/admin/dashboard'); 
    } catch (err) {
      alert("Access Denied: Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="bg-[#0a0a0a] border border-white/5 p-10 rounded-3xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-8">System Access</h2>
        <input 
          type="text" placeholder="Username" className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 mb-4 text-white"
          onChange={(e) => setCredentials({...credentials, username: e.target.value})}
        />
        <input 
          type="password" placeholder="Password" className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 mb-8 text-white"
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        />
        <button className="w-full bg-red-600 py-4 rounded-xl font-bold text-white uppercase tracking-widest hover:bg-red-500">
          Authenticate
        </button>
      </form>
    </div>
  );
}

export default Login;