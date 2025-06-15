import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, Wallet, TrendingUp, TrendingDown, Calendar, DollarSign, Edit3, Trash2, Filter, Search, BarChart3 } from 'lucide-react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Header from './components/Header';
import { User, UserSession } from './types/User';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category: string;
  time: string;
  userId: string; // Add userId to track which user created the transaction
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Check authentication status on component mount
  useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      const session: UserSession = JSON.parse(userSession);
      setCurrentUser(session.user);
    }
  }, []);

  // Load user's transactions when user changes
  useEffect(() => {
    if (currentUser) {
      const savedTransactions = localStorage.getItem(`transactions_${currentUser.id}`);
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      } else {
        setTransactions([]);
      }
    }
  }, [currentUser]);

  // Save transactions whenever they change
  useEffect(() => {
    if (currentUser && transactions.length >= 0) {
      localStorage.setItem(`transactions_${currentUser.id}`, JSON.stringify(transactions));
    }
  }, [transactions, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    const session: UserSession = {
      user,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('userSession', JSON.stringify(session));
    setShowRegister(false);
  };

  const handleRegister = (user: User) => {
    // Auto login after successful registration
    handleLogin(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userSession');
    // Clear form data
    setTransactions([]);
    setAmount('');
    setDescription('');
    setCategory('');
    setSearchTerm('');
    setFilterCategory('');
    setFilterType('all');
    setShowRegister(false);
  };

  const formatNumber = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d]/g, '');
    
    // Add thousand separators
    if (numericValue) {
      return parseInt(numericValue).toLocaleString('id-ID');
    }
    return '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatNumber(value);
    setAmount(formatted);
  };

  const parseAmount = (formattedAmount: string) => {
    return parseInt(formattedAmount.replace(/\./g, '')) || 0;
  };

  const addTransaction = () => {
    if (!amount || !description || !category || !currentUser) return;

    const now = new Date();
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: parseAmount(amount),
      description,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      category,
      userId: currentUser.id
    };

    setTransactions([newTransaction, ...transactions]);
    setAmount('');
    setDescription('');
    setCategory('');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || transaction.category === filterCategory;
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const incomeCategories = ['Gaji', 'Freelance', 'Investasi', 'Bonus', 'Hadiah', 'Penjualan', 'Lainnya'];
  const expenseCategories = ['Makanan & Minuman', 'Transportasi', 'Belanja', 'Tagihan & Utilitas', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Investasi', 'Lainnya'];

  const allCategories = [...new Set([...incomeCategories, ...expenseCategories])];

  // Get recent transactions (last 7 days)
  const recentTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return transactionDate >= weekAgo;
  });

  const thisMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const now = new Date();
    return transactionDate.getMonth() === now.getMonth() && 
           transactionDate.getFullYear() === now.getFullYear();
  });

  const thisMonthIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthExpense = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Show register form
  if (showRegister) {
    return (
      <RegisterForm 
        onRegister={handleRegister}
        onBackToLogin={() => setShowRegister(false)}
      />
    );
  }

  // Show login form if not authenticated
  if (!currentUser) {
    return (
      <LoginForm 
        onLogin={handleLogin}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <Header 
        transactions={transactions}
        recentTransactions={recentTransactions}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Message */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Selamat datang, {currentUser.fullName}! 👋
          </h2>
          <p className="text-blue-100">
            {currentUser.role === 'admin' 
              ? 'Anda masuk sebagai Administrator. Anda dapat mengelola pengguna dan melihat semua data.'
              : 'Kelola catatan keuangan pribadi Anda dengan mudah dan aman.'
            }
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Total Saldo</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(balance)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Saldo keseluruhan</p>
              </div>
              <div className={`p-3 rounded-xl ${balance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`w-6 h-6 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Pemasukan</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                <p className="text-xs text-slate-500 mt-1">Bulan ini: {formatCurrency(thisMonthIncome)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Pengeluaran</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
                <p className="text-xs text-slate-500 mt-1">Bulan ini: {formatCurrency(thisMonthExpense)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">Bulan Ini</p>
                <p className={`text-2xl font-bold ${(thisMonthIncome - thisMonthExpense) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(thisMonthIncome - thisMonthExpense)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Saldo bulanan</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Add Transaction Form */}
          <div className="xl:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sticky top-32">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                Tambah Transaksi
              </h2>
              
              <div className="space-y-5">
                {/* Type Selection */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setType('expense')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-xl border-2 transition-all duration-200 ${
                      type === 'expense'
                        ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <MinusCircle className="w-5 h-5" />
                    <span className="font-medium">Pengeluaran</span>
                  </button>
                  <button
                    onClick={() => setType('income')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-xl border-2 transition-all duration-200 ${
                      type === 'income'
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span className="font-medium">Pemasukan</span>
                  </button>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Jumlah (Rp)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0"
                      className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-medium"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                      IDR
                    </div>
                  </div>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Masukkan deskripsi transaksi..."
                    className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Pilih kategori...</option>
                    {(type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  onClick={addTransaction}
                  disabled={!amount || !description || !category}
                  className={`w-full py-4 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    !amount || !description || !category
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : type === 'expense'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {type === 'expense' ? <MinusCircle className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                    Tambah {type === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="xl:col-span-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Riwayat Transaksi
                </h2>
                <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {filteredTransactions.length} dari {transactions.length} transaksi
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari transaksi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="income">Pemasukan</option>
                  <option value="expense">Pengeluaran</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Semua Kategori</option>
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg font-medium">
                      {transactions.length === 0 ? 'Belum ada transaksi' : 'Tidak ada transaksi yang sesuai'}
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      {transactions.length === 0 ? 'Tambahkan transaksi pertama Anda' : 'Coba ubah filter pencarian'}
                    </p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-5 border border-slate-200/50 rounded-xl hover:bg-white/50 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-lg">{transaction.description}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                              {transaction.category}
                            </span>
                            <span className="text-sm text-slate-500">
                              {formatDate(transaction.date)}
                            </span>
                            <span className="text-sm text-slate-500">
                              {transaction.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`font-bold text-lg ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                          title="Hapus transaksi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}

export default App;