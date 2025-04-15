const DB_NAME = 'KeuanganDB';
const DB_VERSION = 2;
const TRANSACTION_STORE = 'transactions';
const CATEGORY_STORE = 'categories';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains(TRANSACTION_STORE)) {
        db.createObjectStore(TRANSACTION_STORE, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(CATEGORY_STORE)) {
        const categoryStore = db.createObjectStore(CATEGORY_STORE, { keyPath: 'id', autoIncrement: true });
        
        const defaultCategories = [
          { name: 'PDAM', type: 'expense' },
          { name: 'INDIHOME', type: 'expense' },
          { name: 'Gaji', type: 'income' },
          { name: 'Bonus', type: 'income' },
          { name: 'Lainnya', type: 'both' }
        ];

        defaultCategories.forEach(category => {
          categoryStore.add(category);
        });
      }
    };
  });
};

export const addTransaction = async (transaction) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TRANSACTION_STORE, 'readwrite');
    const store = tx.objectStore(TRANSACTION_STORE);
    const request = store.add(transaction);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllTransactions = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TRANSACTION_STORE, 'readonly');
    const store = tx.objectStore(TRANSACTION_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteTransaction = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TRANSACTION_STORE, 'readwrite');
    const store = tx.objectStore(TRANSACTION_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const updateTransaction = async (transaction) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TRANSACTION_STORE, 'readwrite');
    const store = tx.objectStore(TRANSACTION_STORE);
    const request = store.put(transaction);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addCategory = async (category) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CATEGORY_STORE, 'readwrite');
    const store = tx.objectStore(CATEGORY_STORE);
    const request = store.add(category);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllCategories = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CATEGORY_STORE, 'readonly');
    const store = tx.objectStore(CATEGORY_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteCategory = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CATEGORY_STORE, 'readwrite');
    const store = tx.objectStore(CATEGORY_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}; 