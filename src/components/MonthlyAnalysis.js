import React, { useMemo } from 'react';

const MonthlyAnalysis = ({ transactions }) => {
  const monthlyData = useMemo(() => {
    const data = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!data[monthKey]) {
        data[monthKey] = {
          income: 0,
          expense: 0,
          expensesByCategory: {},
          month: date.toLocaleString('id-ID', { month: 'long', year: 'numeric' })
        };
      }
      
      if (transaction.amount > 0) {
        data[monthKey].income += transaction.amount;
      } else {
        data[monthKey].expense += Math.abs(transaction.amount);
        // Mengelompokkan pengeluaran berdasarkan kategori
        const category = transaction.category;
        data[monthKey].expensesByCategory[category] = (data[monthKey].expensesByCategory[category] || 0) + Math.abs(transaction.amount);
      }
    });
    
    return Object.entries(data).sort((a, b) => b[0].localeCompare(a[0]));
  }, [transactions]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Analisis Bulanan</h2>
      <div className="space-y-6">
        {monthlyData.map(([key, data]) => (
          <div key={key} className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">{data.month}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-600">Total Pemasukan</p>
                <p className="text-lg font-bold text-green-700">{formatAmount(data.income)}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-600">Total Pengeluaran</p>
                <p className="text-lg font-bold text-red-700">{formatAmount(data.expense)}</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Rincian Pengeluaran:</h4>
              <div className="space-y-2">
                {Object.entries(data.expensesByCategory).sort((a, b) => b[1] - a[1]).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-600">{category}</span>
                    <span className="text-sm font-medium text-gray-800">
                      {formatAmount(amount)}
                      <span className="text-xs text-gray-500 ml-1">
                        ({((amount / data.expense) * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-700">
                Saldo: {formatAmount(data.income - data.expense)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyAnalysis; 