'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Checkin() {
  const [journal, setJournal] = useState('');
  const [sleep, setSleep] = useState(0);
  const [workload, setWorkload] = useState('low');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journal, sleep, workload }),
      });

      const data = await res.json();

      // ✅ ERROR HANDLING
      if (!res.ok) {
        alert(data.message);
        setLoading(false);
        return;
      }

      localStorage.setItem('result', JSON.stringify(data.data));

      router.push('/result');
    } catch (err) {
      alert('Server error');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Daily Check-in 🧠
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-2 border rounded-lg"
            placeholder="Tulis jurnal kamu..."
            onChange={(e) => setJournal(e.target.value)}
          />

          <input
            type="number"
            className="w-full p-2 border rounded-lg"
            placeholder="Jam tidur"
            onChange={(e) => setSleep(Number(e.target.value))}
          />

          <div>
            <label className="text-sm text-gray-600">
              Tingkat Kesibukan
            </label>

            <select
              className="w-full p-2 border rounded-lg mt-1"
              onChange={(e) => setWorkload(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Analyzing..." : "Analyze My Condition"}
          </button>
        </form>
      </div>
    </div>
  );
}