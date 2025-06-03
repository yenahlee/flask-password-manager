import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5000/register', {
        username,
        password,
      });

      toast.success('Registration successful! You can now login.');
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error('Registration failed. Username may already exist.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleRegister} className="flex flex-col space-y-3">
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
        <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition cursor-pointer">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
