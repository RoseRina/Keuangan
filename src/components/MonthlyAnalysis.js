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
          expenseDetails: [],
          month: date.toLocaleString('id-ID', { month: 'long', year: 'numeric' })
        };
      }
      
      if (transaction.amount > 0) {
        data[monthKey].income += transaction.amount;
      } else {
        const expenseAmount = Math.abs(transaction.amount);
        data[monthKey].expense += expenseAmount;
        // Mengelompokkan pengeluaran berdasarkan kategori
        const category = transaction.category;
        data[monthKey].expensesByCategory[category] = (data[monthKey].expensesByCategory[category] || 0) + expenseAmount;
        
        // Menambahkan detail transaksi
        data[monthKey].expenseDetails.push({
          id: transaction.id,
          date: transaction.date,
          category,
          amount: expenseAmount,
          description: transaction.description
        });
      }
    });
    
    // Mengurutkan detail pengeluaran berdasarkan tanggal
    Object.values(data).forEach(monthData => {
      monthData.expenseDetails.sort((a, b) => new Date(b.date) - new Date(a.date));
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Analisis Bulanan</h2>
      <div className="space-y-6">
        {monthlyData.map(([key, data]) => (
          <div key={key} className="border-b pb-4 last:border-b-0">
            <h3 className="text-md md:text-lg font-medium mb-3">{data.month}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs md:text-sm text-green-600">Total Pemasukan</p>
                <p className="text-sm md:text-base font-bold text-green-700 mt-1">
                  {formatAmount(data.income)}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs md:text-sm text-red-600">Total Pengeluaran</p>
                <p className="text-sm md:text-base font-bold text-red-700 mt-1">
                  {formatAmount(data.expense)}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs md:text-sm font-medium text-gray-700 mb-2">Rincian Pengeluaran:</h4>
              <div className="space-y-4">
                {Object.entries(data.expensesByCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount]) => (
                    <div key={category}>
                      <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-600">{category}</span>
                        <div className="text-right">
                          <span className="font-medium text-gray-800">
                            {formatAmount(amount)}
                          </span>
                          <span className="text-xs text-gray-500 block md:inline md:ml-1">
                            ({((amount / data.expense) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      {/* Detail transaksi per kategori */}
                      <div className="mt-1 pl-2 space-y-1">
                        {data.expenseDetails
                          .filter(detail => detail.category === category)
                          .map(detail => (
                            <div key={detail.id} className="text-xs text-gray-600 flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <span>{formatDate(detail.date)}</span>
                                {detail.description && (
                                  <span className="text-gray-500">- {detail.description}</span>
                                )}
                              </div>
                              <span>{formatAmount(detail.amount)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs md:text-sm text-yellow-700 flex justify-between items-center">
                <span>Saldo:</span>
                <span className="font-bold">{formatAmount(data.income - data.expense)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyAnalysis; 