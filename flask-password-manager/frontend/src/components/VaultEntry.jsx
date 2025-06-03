import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

function VaultEntry({ entry, token, onDelete, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [siteName, setSiteName] = useState(entry.site_name);
  const [siteUsername, setSiteUsername] = useState(entry.site_username);
  const [password, setPassword] = useState(entry.password);
  const [notes, setNotes] = useState(entry.notes);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/update_entry/${entry.id}`, {
        site_name: siteName,
        site_username: siteUsername,
        password,
        notes,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Entry updated!');
      setEditing(false);
      onUpdated(); 
    } catch (err) {
      console.error('Failed to update entry:', err);
      toast.error('Failed to update entry.');
    }
  };

  return (
    <div className="border p-2 mb-2 space-y-1 bg-white shadow-md rounded p-10 mb-4">
      {editing ? (
        <>
          <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="border p-1 w-full" />
          <input value={siteUsername} onChange={(e) => setSiteUsername(e.target.value)} className="border p-1 w-full" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="border p-1 w-full" />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="border p-1 w-full" />
          <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded mr-2 cursor-pointer">Save</button>
          <button onClick={() => setEditing(false)} className="bg-gray-400 text-white px-2 py-1 rounded cursor-pointer">Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Site:</strong> {entry.site_name}</p>
          <p><strong>Username:</strong> {entry.site_username}</p>
          <p><strong>Password:</strong> {entry.password}</p>
          <p><strong>Notes:</strong> {entry.notes}</p>
          <button onClick={() => setEditing(true)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 mt-2 cursor-pointer">Edit</button>
          <button onClick={() => onDelete(entry.id)} className="bg-red-500 text-white px-2 py-1 rounded mt-2 cursor-pointer">Delete</button>
        </>
      )}
    </div>
  );
}

export default VaultEntry;
