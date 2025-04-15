import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';

const firebaseConfig = {
  // Konfigurasi Firebase Anda
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const addTransaction = async (transaction) => {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), transaction);
    return { ...transaction, id: docRef.id };
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const getAllTransactions = async () => {
  try {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    await deleteDoc(doc(db, 'transactions', id));
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}; 