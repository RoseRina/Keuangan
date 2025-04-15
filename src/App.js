import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';
import MonthlyAnalysis from './components/MonthlyAnalysis';
import CategoryManager from './components/CategoryManager';
import { 
  initDB, 
  addTransaction as addToDB, 
  getAllTransactions, 
  deleteTransaction as deleteFromDB, 
  updateTransaction,
  getAllCategories,
  addCategory as addCategoryToDB,
  deleteCategory as deleteCategoryFromDB
} from './utils/db';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Inisialisasi dan ambil data saat komponen dimuat
  useEffect(() => {
    const loadData = async () => {
      await initDB();
      const [transactionsData, categoriesData] = await Promise.all([
        getAllTransactions(),
        getAllCategories()
      ]);
      setTransactions(transactionsData);
      setCategories(categoriesData);
    };
    loadData();
  }, []);

  const handleSubmit = async (transaction) => {
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
      await updateTransaction(updatedTransaction);
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id ? updatedTransaction : t
      ));
      setEditingTransaction(null);
    } else {
      // Mode Tambah
      const newTransaction = { ...transaction, id: Date.now() };
      await addToDB(newTransaction);
      setTransactions([...transactions, newTransaction]);
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
    await deleteFromDB(id);
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const addCategory = async (category) => {
    const newCategory = await addCategoryToDB(category);
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = async (id) => {
    await deleteCategoryFromDB(id);
    setCategories(categories.filter(category => category.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6 md:mb-8">
          Manajemen Keuangan
        </h1>
        
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