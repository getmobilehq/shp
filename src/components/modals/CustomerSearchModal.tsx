import React, { useState } from 'react';
import { Search, X, User, Phone, Mail, MapPin } from 'lucide-react';
import { useCustomer } from '../../hooks/useCustomer';
import { Customer } from '../../types';
import { DPAModal } from './DPAModal';

interface CustomerSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+44 7700 900123',
    address: {
      street: '123 High Street',
      city: 'London',
      postcode: 'SW1A 1AA'
    },
    verified: false,
    subscription: {
      id: 'sub-1',
      plan: 'plus',
      status: 'active',
      startDate: '2024-01-15',
      nextRenewal: '2025-01-15',
      lastPayment: '2024-01-15',
      history: []
    },
    devices: [
      {
        id: 'dev-1',
        name: 'Google Nest Doorbell (wired)',
        location: 'Front Door',
        type: 'doorbell',
        status: 'online',
        lastSeen: '2025-01-10T10:30:00Z',
        rssi: -45
      },
      {
        id: 'dev-2',
        name: 'Google Nest Cam Indoor',
        location: 'Living Room',
        type: 'camera',
        status: 'online',
        lastSeen: '2025-01-10T10:25:00Z',
        rssi: -52
      },
      {
        id: 'dev-3',
        name: 'Google Nest Mini',
        location: 'Kitchen',
        type: 'hub',
        status: 'offline',
        lastSeen: '2025-01-09T15:30:00Z',
        rssi: -78
      }
    ],
    connectivity: {
      status: 'good',
      signalStrength: 85,
      downloadSpeed: 50,
      uploadSpeed: 12,
      lastSpeedTest: '2025-01-10T10:30:00Z'
    }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+44 7700 900456',
    address: {
      street: '456 Oak Avenue',
      city: 'Manchester',
      postcode: 'M1 1AB'
    },
    verified: false,
    subscription: {
      id: 'sub-2',
      plan: 'pro',
      status: 'active',
      startDate: '2023-06-01',
      nextRenewal: '2025-06-01',
      lastPayment: '2024-06-01',
      history: []
    },
    devices: [
      {
        id: 'dev-5',
        name: 'Google Nest Doorbell (battery)',
        location: 'Front Door',
        type: 'doorbell',
        status: 'online',
        lastSeen: '2025-01-10T09:15:00Z',
        rssi: -38
      },
      {
        id: 'dev-6',
        name: 'Google Nest Cam Indoor',
        location: 'Bedroom',
        type: 'camera',
        status: 'online',
        lastSeen: '2025-01-10T10:20:00Z',
        rssi: -42
      },
      {
        id: 'dev-7',
        name: 'Google Nest Mini',
        location: 'Living Room',
        type: 'hub',
        status: 'online',
        lastSeen: '2025-01-10T10:20:00Z',
        rssi: -48
      }
    ],
    connectivity: {
      status: 'weak',
      signalStrength: 35,
      downloadSpeed: 15,
      uploadSpeed: 3,
      lastSpeedTest: '2025-01-10T10:25:00Z'
    }
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '+44 7700 900789',
    address: {
      street: '789 Pine Road',
      city: 'Birmingham',
      postcode: 'B1 2CD'
    },
    verified: false,
    subscription: {
      id: 'sub-3',
      plan: 'free',
      status: 'downgraded',
      startDate: '2024-03-01',
      nextRenewal: '2025-03-01',
      lastPayment: '2024-09-01',
      history: []
    },
    devices: [
      {
        id: 'dev-8',
        name: 'Google Nest Doorbell (wired)',
        location: 'Front Door',
        type: 'doorbell',
        status: 'offline',
        lastSeen: '2025-01-08T14:20:00Z',
        rssi: -65
      },
      {
        id: 'dev-9',
        name: 'Google Nest Cam Outdoor',
        location: 'Back Garden',
        type: 'camera',
        status: 'online',
        lastSeen: '2025-01-10T08:45:00Z',
        rssi: -55
      }
    ],
    connectivity: {
      status: 'down',
      signalStrength: 0,
      downloadSpeed: 0,
      uploadSpeed: 0,
      lastSpeedTest: '2025-01-08T14:20:00Z'
    }
  }
];

export const CustomerSearchModal: React.FC<CustomerSearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDPA, setShowDPA] = useState(false);
  const { setCurrentCustomer, setDpaVerified } = useCustomer();

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDPA(true);
  };

  const handleDPASuccess = () => {
    if (selectedCustomer) {
      setCurrentCustomer(selectedCustomer);
      setDpaVerified(true);
      setShowDPA(false);
      onClose();
      setSearchTerm('');
      setSelectedCustomer(null);
    }
  };

  const handleDPAClose = () => {
    setShowDPA(false);
    setSelectedCustomer(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Search Customer</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by name, email, or phone..."
                autoFocus
              />
            </div>
          </div>

          <div className="p-6 max-h-96 overflow-y-auto">
            {searchTerm.length > 0 ? (
              filteredCustomers.length > 0 ? (
                <div className="space-y-3">
                  {filteredCustomers.map(customer => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{customer.name}</h3>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{customer.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{customer.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{customer.address.street}, {customer.address.city}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-600">
                            {customer.subscription.plan.charAt(0).toUpperCase() + customer.subscription.plan.slice(1)} Plan
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No customers found matching your search.</p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">Start typing to search for customers</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDPA && selectedCustomer && (
        <DPAModal
          customer={selectedCustomer}
          onSuccess={handleDPASuccess}
          onClose={handleDPAClose}
        />
      )}
    </>
  );
};