const API_URL = 'http://localhost:3001'; // URL JSON Server

// Fungsi helper untuk HTTP requests
const fetchWithError = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Fungsi untuk transaksi
export const addTransaction = async (transaction) => {
  return fetchWithError(`${API_URL}/transactions`, {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
};

export const getAllTransactions = async () => {
  return fetchWithError(`${API_URL}/transactions?_sort=date&_order=desc`);
};

export const updateTransaction = async (transaction) => {
  return fetchWithError(`${API_URL}/transactions/${transaction.id}`, {
    method: 'PUT',
    body: JSON.stringify(transaction),
  });
};

export const deleteTransaction = async (id) => {
  return fetchWithError(`${API_URL}/transactions/${id}`, {
    method: 'DELETE',
  });
};

// Fungsi untuk kategori
export const getAllCategories = async () => {
  return fetchWithError(`${API_URL}/categories`);
};

export const addCategory = async (category) => {
  return fetchWithError(`${API_URL}/categories`, {
    method: 'POST',
    body: JSON.stringify(category),
  });
};

export const deleteCategory = async (id) => {
  // Periksa apakah kategori digunakan dalam transaksi
  const transactions = await fetchWithError(
    `${API_URL}/transactions?category=${id}`
  );
  
  if (transactions.length > 0) {
    throw new Error('Kategori ini masih digunakan dalam transaksi');
  }

  return fetchWithError(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
  });
}; 