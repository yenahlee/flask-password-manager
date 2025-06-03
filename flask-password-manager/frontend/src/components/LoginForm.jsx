import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function LoginForm({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        username,
        password,
      });

      setToken(response.data.access_token);
      localStorage.setItem('token', response.data.access_token);
      toast.success('Logged in successfully!');
    } catch (err) {
      console.error('Login failed:', err);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col space-y-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition cursor-pointer">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
