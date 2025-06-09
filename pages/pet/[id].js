import { getDoc, doc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Configura Firebase (¡REMPLAZA CON TUS DATOS!)
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

export async function getServerSideProps(context) {
  const { id } = context.params;
  const petDoc = await getDoc(doc(db, 'pets', id));
  return { props: { pet: petDoc.exists() ? { id: petDoc.id, ...petDoc.data() } : null } };
}

export default function PetView({ pet }) {
  if (!pet) return <div>Mascota no encontrada</div>;
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🐾 {pet.name}</h1>
      <p><strong>Vacunado:</strong> {pet.vaccinated ? 'Sí ✅' : 'No ❌'}</p>
      <p><strong>Contacto:</strong> {pet.contact}</p>
    </div>
  );
  }
