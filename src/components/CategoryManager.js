import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const CategoryManager = ({ categories, onAddCategory, onDeleteCategory }) => {
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense' });
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      onAddCategory(newCategory);
      setNewCategory({ name: '', type: 'expense' });
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold">Kelola Kategori</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Tambah Kategori
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Kategori
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nama kategori"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipe Kategori
              </label>
              <select
                value={newCategory.type}
                onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
                <option value="both">Keduanya</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-4 px-4 py-2 bg-gray-50 rounded-t-lg">
          <div className="text-sm font-medium text-gray-500">Nama</div>
          <div className="text-sm font-medium text-gray-500">Tipe</div>
          <div className="text-sm font-medium text-gray-500 text-right">Aksi</div>
        </div>
        {categories.map((category) => (
          <div
            key={category.id}
            className="grid grid-cols-3 gap-4 px-4 py-2 bg-white rounded-lg border items-center"
          >
            <div className="text-sm">{category.name}</div>
            <div className="text-sm">
              {category.type === 'expense' && 'Pengeluaran'}
              {category.type === 'income' && 'Pemasukan'}
              {category.type === 'both' && 'Keduanya'}
            </div>
            <div className="text-right">
              <button
                onClick={() => onDeleteCategory(category.id)}
                className="text-red-600 hover:text-red-800 p-1"
                disabled={category.name === 'Lainnya'}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager; 