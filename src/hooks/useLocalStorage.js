import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  // Fungsi untuk mendapatkan nilai awal dari localStorage
  const getStoredValue = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  };

  // State untuk menyimpan nilai
  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Fungsi untuk mengupdate nilai dan menyimpan ke localStorage
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage; 