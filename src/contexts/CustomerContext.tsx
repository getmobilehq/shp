import React, { createContext, useState, ReactNode } from 'react';
import { Customer, DPAAttempt } from '../types';

interface CustomerContextType {
  currentCustomer: Customer | null;
  selectedCustomer: Customer | null;
  setCurrentCustomer: (customer: Customer | null) => void;
  dpaVerified: boolean;
  setDpaVerified: (verified: boolean) => void;
  dpaAttempts: DPAAttempt[];
  addDpaAttempt: (attempt: DPAAttempt) => void;
}

export const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({ children }) => {
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [dpaVerified, setDpaVerified] = useState(false);
  const [dpaAttempts, setDpaAttempts] = useState<DPAAttempt[]>([]);

  const addDpaAttempt = (attempt: DPAAttempt) => {
    setDpaAttempts(prev => [attempt, ...prev.slice(0, 9)]); // Keep last 10 attempts
  };

  return (
    <CustomerContext.Provider value={{
      currentCustomer,
      selectedCustomer: currentCustomer,
      setCurrentCustomer,
      dpaVerified,
      setDpaVerified,
      dpaAttempts,
      addDpaAttempt
    }}>
      {children}
    </CustomerContext.Provider>
  );
};