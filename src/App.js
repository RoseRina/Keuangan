import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';
import MonthlyAnalysis from './components/MonthlyAnalysis';
import { initDB, addTransaction as addToDB, getAllTransactions, deleteTransaction as deleteFromDB } from './utils/db';

function App() {
  const [transactions, setTransactions] = useState([]);

  // Inisialisasi dan ambil data saat komponen dimuat
  useEffect(() => {
    const loadTransactions = async () => {
      await initDB();
      const data = await getAllTransactions();
      setTransactions(data);
    };
    loadTransactions();
  }, []);

  const addTransaction = async (transaction) => {
    const newTransaction = { ...transaction, id: Date.now() };
    await addToDB(newTransaction);
    setTransactions([...transactions, newTransaction]);
  };

  const deleteTransaction = async (id) => {
    await deleteFromDB(id);
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Manajemen Keuangan
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <TransactionForm onSubmit={addTransaction} />
          </div>
          <div>
            <Summary transactions={transactions} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <TransactionList 
              transactions={transactions} 
              onDelete={deleteTransaction}
            />
          </div>
          <div>
            <MonthlyAnalysis transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 