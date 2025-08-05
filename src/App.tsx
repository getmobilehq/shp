import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CustomerProvider } from './contexts/CustomerContext';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/auth/LoginPage';
import { Layout } from './components/layout/Layout';
import { CustomerOverview } from './pages/CustomerOverview';
import { SubscriptionInfo } from './pages/SubscriptionInfo';
import { ProductDetail } from './pages/ProductDetail';
import { Diagnostics } from './pages/Diagnostics';
import { KnowledgeBase } from './pages/KnowledgeBase';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <CustomerProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CustomerOverview />} />
          <Route path="subscription" element={<SubscriptionInfo />} />
          <Route path="products" element={<ProductDetail />} />
          <Route path="diagnostics" element={<Diagnostics />} />
          <Route path="knowledge" element={<KnowledgeBase />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CustomerProvider>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;