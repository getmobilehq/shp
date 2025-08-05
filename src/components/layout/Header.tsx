import React, { useState } from 'react';
import { useCustomer } from '../../hooks/useCustomer';
import { Search, Bell, Settings } from 'lucide-react';
import { CustomerSearchModal } from '../modals/CustomerSearchModal';

export const Header: React.FC = () => {
  const { currentCustomer } = useCustomer();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">
                {currentCustomer ? `Current: ${currentCustomer.name}` : 'Search customer...'}
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <CustomerSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};