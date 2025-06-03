import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import VaultEntry from '../components/VaultEntry';

function VaultPage({ token }) {
  const [vault, setVault] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getVault = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/vault', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVault(response.data);
    } catch (err) {
      console.error('Failed to load vault:', err);
      toast.error('Failed to load vault.');
    }
  };

  useEffect(() => {
    getVault();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/delete_entry/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Entry deleted!');
      setRefresh(!refresh); 
    } catch (err) {
      console.error('Failed to delete entry:', err);
      toast.error('Failed to delete entry.');
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Your Vault</h2>
        {vault.length === 0 ? (
          <p className="text-center text-gray-600 italic">No entries in your vault yet.</p>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {vault.map((entry) => (
                <VaultEntry
                  key={entry.id}
                  entry={entry}
                  token={token}
                  onDelete={handleDelete}
                  onUpdated={() => setRefresh(!refresh)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VaultPage;
