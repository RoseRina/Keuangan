import React, { useState } from 'react';

const TransactionForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'PDAM',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = {
    expense: ['PDAM', 'INDIHOME', 'Lainnya'],
    income: ['Gaji', 'Bonus', 'Lainnya']
  };

  const formatRupiah = (angka) => {
    if (!angka) return '';
    // Hapus semua karakter non-digit
    const number = angka.toString().replace(/\D/g, '');
    // Format dengan pemisah ribuan
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Hapus semua karakter non-digit
    const numericValue = value.replace(/\D/g, '');
    
    setFormData(prev => ({
      ...prev,
      // Simpan nilai numerik asli
      amount: numericValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: formData.type === 'expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount))
    });
    setFormData({
      ...formData,
      amount: '',
      description: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Tambah Transaksi</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tipe Transaksi
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="expense">Pengeluaran</option>
            <option value="income">Pemasukan</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Kategori
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            {categories[formData.type].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Jumlah (Rp)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-600">Rp</span>
            <input
              type="text"
              name="amount"
              value={formatRupiah(formData.amount)}
              onChange={handleAmountChange}
              className="w-full p-2 pl-12 border rounded-md"
              required
              placeholder="0"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tanggal
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Keterangan
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Tambahkan keterangan..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Tambah Transaksi
        </button>
      </form>
    </div>
  );
};

export default TransactionForm; 