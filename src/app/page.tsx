'use client';
import { useState } from 'react';

// Definimos una interfaz para las notas en lugar de usar 'any'
interface Note {
  id: number;
  title: string;
  content: string;
  restricted: boolean;
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      setToken(data.token);
      setRole(data.role);
      fetchNotes(data.token);
    } else {
      setError(data.message);
    }
  };

  const fetchNotes = async (authToken: string) => {
    const res = await fetch('/api/notes', {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    const data = await res.json();
    if (data.success) setNotes(data.data);
  };

  return (
    <main className="p-10 max-w-md mx-auto bg-gray-300  rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-black">Security Audit Lab</h1>
      {!token ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username-input"
              className="block text-sm color-white-700 text-black"
            >
              Usuario :
            </label>
            <input
              id="username-input"
              aria-label="Usuario"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 w-full rounded text-black text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="password-input" className="block text-sm color-white-700 
            text-black">
              Contraseña:
            </label>
            <input
              id="password-input"
              aria-label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full rounded text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-pink-200 text-black p-2 w-full rounded color-white-700"
          >
            Iniciar Sesión
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      ) : (
        <div>
          <p className="mb-2">
            Rol Actual: <span className="font-semibold uppercase">{role}</span>
          </p>
          <h2 className="text-xl font-semibold mt-4">Notas Disponibles:</h2>
          <ul className="list-disc pl-5 mt-2">
            {notes.map((note) => (
              <li key={note.id} className="mb-2">
                <strong>{note.title}</strong>: {note.content}
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              setToken("");
              setNotes([]);
            }}
            className="mt-6 bg-gray-600 text-white p-2 w-full rounded"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </main>
  );
}