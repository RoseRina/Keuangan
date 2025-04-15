import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';
import MonthlyAnalysis from './components/MonthlyAnalysis';
import { initDB, addTransaction as addToDB, getAllTransactions, deleteTransaction as deleteFromDB, updateTransaction } from './utils/db';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Inisialisasi dan ambil data saat komponen dimuat
  useEffect(() => {
    const loadTransactions = async () => {
      await initDB();
      const data = await getAllTransactions();
      setTransactions(data);
    };
    loadTransactions();
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
            />
          </div>
          <div className="order-1 lg:order-2">
            <Summary transactions={transactions} />
          </div>
        </div>

        {/* TransactionList dan MonthlyAnalysis */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8">
          <div>
            <TransactionList 
              transactions={transactions} 
              onDelete={deleteTransaction}
              onEdit={handleEdit}
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