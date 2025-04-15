import React from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const TransactionList = ({ transactions, onDelete, onEdit }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-xl font-semibold p-6 border-b">Riwayat Transaksi</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Belum ada transaksi
                </td>
              </tr>
            ) : (
              transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.description || '-'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                    transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatAmount(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList; 