import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase - reemplazá con tus credenciales desde Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCqJYJittyRYazmMJ0nA8Oh0Zb7weMD-kI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "solemjoyas-1632f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "solemjoyas-1632f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "solemjoyas-1632f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "295198497491",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:295198497491:web:3d27ffd703e32268e85226"
  measurementId: "G-JVB5CHNHD0"
};





// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
