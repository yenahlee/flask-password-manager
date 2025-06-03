import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function AddEntryPage({ token }) {
  const [siteName, setSiteName] = useState('');
  const [siteUsername, setSiteUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddEntry = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://127.0.0.1:5000/add_entry', {
        site_name: siteName,
        site_username: siteUsername,
        password,
        notes,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Entry added successfully!');
      setSiteName('');
      setSiteUsername('');
      setPassword('');
      setNotes('');
    } catch (err) {
      console.error('Failed to add entry:', err);
      toast.error('Failed to add entry.');
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
    
      <div className="mt-8 flex justify-center">
        <h1 className="text-3xl font-bold">Add Vault Entry</h1>
      </div>

      <div className="flex-grow flex justify-center pt-20">
        <div className>
          <form onSubmit={handleAddEntry} className="flex flex-col space-y-3 bg-white shadow-md rounded px-10 py-10 w-full max-w-sm">
            <input
              type="text"
              placeholder="Site Name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Site Username"
              value={siteUsername}
              onChange={(e) => setSiteUsername(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border p-2 rounded"
              rows="3"
            />
            <button type="submit" className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition cursor-pointer">
              Add Entry
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}

export default AddEntryPage;
