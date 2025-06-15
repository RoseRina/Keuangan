import React, { useState } from 'react';
import { Wallet, BarChart3, Calendar, LogOut, Shield, Users, User as UserIcon } from 'lucide-react';
import { User } from '../types/User';
import UserManagement from './UserManagement';

interface HeaderProps {
  transactions: any[];
  recentTransactions: any[];
  currentUser: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ transactions, recentTransactions, currentUser, onLogout }) => {
  const [showUserManagement, setShowUserManagement] = useState(false);

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Catatan Keuangan
                </h1>
                <p className="text-slate-600 text-sm">Kelola pemasukan dan pengeluaran dengan mudah</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>{transactions.length} Transaksi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{recentTransactions.length} Minggu Ini</span>
                </div>
              </div>

              {/* User Management Button (Admin Only) */}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setShowUserManagement(true)}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-lg transition-all duration-200"
                  title="Kelola pengguna"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:block">Kelola User</span>
                </button>
              )}

              {/* User Badge */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                currentUser.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {currentUser.role === 'admin' ? (
                  <Shield className="w-4 h-4" />
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
                <div className="text-sm">
                  <div className="font-medium">{currentUser.fullName}</div>
                  <div className="text-xs opacity-75">@{currentUser.username}</div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
                title="Keluar dari sistem"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Modal */}
      {showUserManagement && (
        <UserManagement onClose={() => setShowUserManagement(false)} />
      )}
    </>
  );
};

export default Header;