import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc,
  where,
  writeBatch
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

// Fungsi untuk transaksi
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

export const updateTransaction = async (transaction) => {
  try {
    const { id, ...data } = transaction;
    await updateDoc(doc(db, 'transactions', id), data);
    return transaction;
  } catch (error) {
    console.error('Error updating transaction:', error);
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

// Fungsi untuk kategori
export const initializeDefaultCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    if (snapshot.empty) {
      const batch = writeBatch(db);
      const defaultCategories = [
        { name: 'PDAM', type: 'expense' },
        { name: 'INDIHOME', type: 'expense' },
        { name: 'Gaji', type: 'income' },
        { name: 'Bonus', type: 'income' },
        { name: 'Lainnya', type: 'both' }
      ];

      defaultCategories.forEach(category => {
        const docRef = doc(collection(db, 'categories'));
        batch.set(docRef, category);
      });

      await batch.commit();
    }
  } catch (error) {
    console.error('Error initializing default categories:', error);
    throw error;
  }
};

export const addCategory = async (category) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), category);
    return { ...category, id: docRef.id };
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    // Periksa apakah kategori digunakan dalam transaksi
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('category', '==', id)
    );
    const transactionsSnapshot = await getDocs(transactionsQuery);
    
    if (!transactionsSnapshot.empty) {
      throw new Error('Kategori ini masih digunakan dalam transaksi');
    }

    await deleteDoc(doc(db, 'categories', id));
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}; 