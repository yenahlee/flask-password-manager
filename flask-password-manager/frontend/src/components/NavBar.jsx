import React from 'react';
import { Link } from 'react-router-dom';

function NavBar({ token, handleLogout }) {
  return (
    <nav className="flex space-x-4 px-8 py-5 bg-[#019ef3]">
      {!token ? (
        // If NOT logged in: show Login + Register
        <>
          <Link to="/login" className="text-white text-2xl">Login</Link>
          <Link to="/register" className="text-white text-2xl">Register</Link>
        </>
      ) : (
        // If logged in: show Vault + Add Entry + Logout
        <>
          <Link to="/vault" className="text-white text-2xl">Vault</Link>
          <Link to="/add-entry" className="text-white text-2xl">Add Entry</Link>
          <button
            onClick={handleLogout}
            className="text-white text-2xl px-2 rounded cursor-pointer"
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default NavBar;
