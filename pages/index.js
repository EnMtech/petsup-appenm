import { useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'PetsUp' && password === 'Marla*Roni') {
      setIsLoggedIn(true);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-80">
          <h1 className="text-2xl font-bold mb-6 text-center">Login PetsUp</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Usuario"
              className="w-full p-2 mb-4 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full p-2 mb-4 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';

// Configura Firebase (¡REMPLAZA ESTOS DATOS CON LOS TUYOS!)
const firebaseConfig = {
  apiKey: "AIzaSyCT7T6Nzy__FsajHCcbGm64rAJtEzbuC0w",
  authDomain: "petsup-6b5c3.firebaseapp.com",
  projectId: "petsup-6b5c3",
  storageBucket: "petsup-6b5c3.firebasestorage.app",
  messagingSenderId: "1040871101191",
  appId: "1:1040871101191:web:ef97830d6948d369e06ba2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function PetsUp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pets, setPets] = useState([]);
  const [newPet, setNewPet] = useState({ name: '', vaccinated: false, contact: '' });

  // Login (Usuario: PetsUp, Contraseña: Marla*Roni)
  const handleLogin = () => {
    if (username === 'PetsUp' && password === 'Marla*Roni') {
      setLoggedIn(true);
      fetchPets();
    } else {
      alert('¡Credenciales incorrectas!');
    }
  };

  // Obtener mascotas
  const fetchPets = async () => {
    const querySnapshot = await getDocs(collection(db, 'pets'));
    setPets(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Añadir mascota
  const addPet = async () => {
    await addDoc(collection(db, 'pets'), newPet);
    setNewPet({ name: '', vaccinated: false, contact: '' });
    fetchPets();
  };

  // Eliminar mascota
  const deletePet = async (id) => {
    await deleteDoc(doc(db, 'pets', id));
    fetchPets();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      {!loggedIn ? (
        <div>
          <h1>🔒 Iniciar Sesión</h1>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc' }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc' }}
          />
          <button
            onClick={handleLogin}
            style={{ width: '100%', padding: '10px', background: '#4CAF50', color: 'white', border: 'none' }}
          >
            Entrar
          </button>
        </div>
      ) : (
        <div>
          <h1>🐶 PetsUp</h1>
          <div style={{ margin: '20px 0' }}>
            <h2>➕ Añadir Mascota</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={newPet.name}
              onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
              style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }}
            />
            <label style={{ display: 'block', margin: '10px 0' }}>
              <input
                type="checkbox"
                checked={newPet.vaccinated}
                onChange={(e) => setNewPet({ ...newPet, vaccinated: e.target.checked })}
              />
              ¿Vacunado?
            </label>
            <textarea
              placeholder="Notas de contacto"
              value={newPet.contact}
              onChange={(e) => setNewPet({ ...newPet, contact: e.target.value })}
              style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', height: '80px' }}
            />
            <button
              onClick={addPet}
              style={{ width: '100%', padding: '10px', background: '#2196F3', color: 'white', border: 'none' }}
            >
              Guardar
            </button>
          </div>
          <div>
            <h2>📋 Lista de Mascotas</h2>
            {pets.map((pet) => (
              <div key={pet.id} style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
                <h3 style={{ margin: '0' }}>{pet.name} {pet.vaccinated ? '✅' : '❌'}</h3>
                <p style={{ color: '#666' }}>{pet.contact}</p>
                <button
                  onClick={() => deletePet(pet.id)}
                  style={{ padding: '5px 10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '3px' }}
                >
                  Eliminar
                </button>
                <p style={{ color: 'blue', marginTop: '5px' }}>
                  Enlace para compartir: <br />
                  https://TU_APP.vercel.app/pet/{pet.id}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
