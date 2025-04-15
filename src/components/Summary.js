import React from 'react';

const Summary = ({ transactions }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateSummary = () => {
    return transactions.reduce(
      (summary, transaction) => {
        const amount = transaction.amount;
        if (amount > 0) {
          summary.income += amount;
        } else {
          summary.expense += Math.abs(amount);
        }
        summary.balance += amount;
        return summary;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  };

  const { income, expense, balance } = calculateSummary();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Ringkasan Keuangan</h2>
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        <div className="p-3 md:p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Total Pemasukan</p>
          <p className="text-xl md:text-2xl font-bold text-green-700 mt-1">
            {formatAmount(income)}
          </p>
        </div>
        
        <div className="p-3 md:p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Total Pengeluaran</p>
          <p className="text-xl md:text-2xl font-bold text-red-700 mt-1">
            {formatAmount(expense)}
          </p>
        </div>
        
        <div className={`p-3 md:p-4 ${balance >= 0 ? 'bg-blue-50' : 'bg-yellow-50'} rounded-lg`}>
          <p className={`text-sm ${balance >= 0 ? 'text-blue-600' : 'text-yellow-600'} font-medium`}>
            Saldo
          </p>
          <p className={`text-xl md:text-2xl font-bold mt-1 ${balance >= 0 ? 'text-blue-700' : 'text-yellow-700'}`}>
            {formatAmount(balance)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary; 