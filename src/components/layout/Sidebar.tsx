import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCustomer } from '../../hooks/useCustomer';
import {
  Home,
  CreditCard,
  Package,
  Stethoscope,
  BookOpen,
  User,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    name: 'Customer Overview',
    href: '/',
    icon: Home,
    requiredPermissions: ['view_customers']
  },
  {
    name: 'Subscription Info',
    href: '/subscription',
    icon: CreditCard,
    requiredPermissions: ['view_customers']
  },
  {
    name: 'Product Detail',
    href: '/products',
    icon: Package,
    requiredPermissions: ['view_customers']
  },
  {
    name: 'Diagnostics',
    href: '/diagnostics',
    icon: Stethoscope,
    requiredPermissions: ['access_diagnostics']
  },
  {
    name: 'Knowledge Base',
    href: '/knowledge',
    icon: BookOpen,
    requiredPermissions: ['view_customers']
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const { currentCustomer, dpaVerified } = useCustomer();
  const location = useLocation();

  const hasPermission = (permissions: string[]) => {
    return permissions.some(permission => user?.permissions.includes(permission));
  };

  return (
    <div className={clsx(
      'bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-gray-900">SH Portal</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Current Customer */}
      {currentCustomer && !isCollapsed && (
        <div className="p-4 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{currentCustomer.name}</p>
              <div className="flex items-center space-x-2">
                <div className={clsx(
                  'w-2 h-2 rounded-full',
                  dpaVerified ? 'bg-green-500' : 'bg-red-500'
                )} />
                <span className="text-sm text-gray-600">
                  {dpaVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const canAccess = hasPermission(item.requiredPermissions);
            
            if (!canAccess) return null;

            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={clsx(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && user && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900 text-sm">{user.name}</p>
            <p className="text-gray-600 text-xs">Agent</p>
          </div>
        )}
        <button
          onClick={logout}
          className={clsx(
            'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full',
            isCollapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};