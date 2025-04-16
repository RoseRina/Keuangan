import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';
import MonthlyAnalysis from './components/MonthlyAnalysis';
import CategoryManager from './components/CategoryManager';
import { 
  addTransaction as addToDB, 
  getAllTransactions, 
  deleteTransaction as deleteFromDB, 
  updateTransaction,
  getAllCategories,
  addCategory as addCategoryToDB,
  deleteCategory as deleteCategoryFromDB
} from './utils/api';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inisialisasi dan ambil data saat komponen dimuat
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Ambil data transaksi dan kategori
        const [transactionsData, categoriesData] = await Promise.all([
          getAllTransactions(),
          getAllCategories()
        ]);
        
        setTransactions(transactionsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleSubmit = async (transaction) => {
    try {
      if (!transaction) {
        // Jika transaction null, berarti membatalkan edit
        setEditingTransaction(null);
        return;
      }

      if (editingTransaction) {
        // Mode Edit
        const updatedTransaction = {
          ...transaction,
          id: editingTransaction.id
        };
        const result = await updateTransaction(updatedTransaction);
        setTransactions(transactions.map(t => 
          t.id === editingTransaction.id ? result : t
        ));
        setEditingTransaction(null);
      } else {
        // Mode Tambah
        const newTransaction = await addToDB(transaction);
        setTransactions([...transactions, newTransaction]);
      }
      setError(null);
    } catch (err) {
      console.error('Error handling transaction:', err);
      setError('Gagal menyimpan transaksi. Silakan coba lagi.');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    // Scroll ke form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteFromDB(id);
      setTransactions(transactions.filter(transaction => transaction.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Gagal menghapus transaksi. Silakan coba lagi.');
    }
  };

  const addCategory = async (category) => {
    try {
      const newCategory = await addCategoryToDB(category);
      setCategories([...categories, newCategory]);
      setError(null);
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Gagal menambah kategori. Silakan coba lagi.');
    }
  };

  const deleteCategory = async (id) => {
    try {
      await deleteCategoryFromDB(id);
      setCategories(categories.filter(category => category.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      if (err.message === 'Kategori ini masih digunakan dalam transaksi') {
        setError('Tidak dapat menghapus kategori yang masih digunakan dalam transaksi.');
      } else {
        setError('Gagal menghapus kategori. Silakan coba lagi.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6 md:mb-8">
          Manajemen Keuangan
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Form dan Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8">
          <div className="order-2 lg:order-1">
            <TransactionForm 
              onSubmit={handleSubmit}
              editingTransaction={editingTransaction}
              categories={categories}
            />
          </div>
          <div className="order-1 lg:order-2">
            <Summary transactions={transactions} />
          </div>
        </div>

        {/* Tombol Kelola Kategori */}
        <div className="mb-4 md:mb-8">
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showCategoryManager ? 'Tutup Kelola Kategori' : 'Kelola Kategori'}
          </button>
        </div>

        {/* Category Manager */}
        {showCategoryManager && (
          <div className="mb-4 md:mb-8">
            <CategoryManager
              categories={categories}
              onAddCategory={addCategory}
              onDeleteCategory={deleteCategory}
            />
          </div>
        )}

        {/* TransactionList dan MonthlyAnalysis */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8">
          <div>
            <TransactionList 
              transactions={transactions} 
              onDelete={deleteTransaction}
              onEdit={handleEdit}
              categories={categories}
            />
          </div>
          <div className="mt-4 xl:mt-0">
            <MonthlyAnalysis transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 