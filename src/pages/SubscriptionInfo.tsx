import React, { useState, useMemo } from 'react';
import { useCustomer } from '../hooks/useCustomer';
import { useAuth } from '../hooks/useAuth';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit3,
  X,
  Info,
  Video,
  Cloud,
  Bell,
  Users,
  Zap,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  History
} from 'lucide-react';
import { SubscriptionChange } from '../types';
import { format, subMonths, addDays } from 'date-fns';
import clsx from 'clsx';

interface SubscriptionChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, details?: string) => void;
  currentPlan: string;
  targetPlan: string;
}

const SubscriptionChangeModal: React.FC<SubscriptionChangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentPlan,
  targetPlan
}) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onConfirm(reason, details);
    setIsSubmitting(false);
    setReason('');
    setDetails('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Subscription Change</h2>
                <p className="text-sm text-gray-600">Justification Required</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-900 mb-1">Plan Change</p>
              <p className="text-sm text-blue-700">
                {currentPlan} → {targetPlan}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Change *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select reason...</option>
                <option value="customer_unable_to_self_serve">Customer unable to self-serve</option>
                <option value="billing_error">Billing error</option>
                <option value="internal_testing">Internal testing</option>
                <option value="other">Other</option>
              </select>
            </div>

            {reason === 'other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Provide detailed reason..."
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleSubmit}
                disabled={!reason || isSubmitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Change'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SubscriptionHistoryEntry {
  id: string;
  period: string;
  plan: string;
  status: 'active' | 'downgraded' | 'upgraded' | 'cancelled';
  amount: number;
  startDate: string;
  endDate: string;
  invoiceNumber?: string;
  paymentMethod?: string;
  changes?: {
    date: string;
    from: string;
    to: string;
    reason: string;
  }[];
}

interface HistoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: SubscriptionHistoryEntry | null;
}

const HistoryDetailsModal: React.FC<HistoryDetailsModalProps> = ({ isOpen, onClose, entry }) => {
  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Subscription Details</h2>
              <p className="text-sm text-gray-600">{entry.period}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          <div className="space-y-6">
            {/* Plan Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Plan Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Plan Type</p>
                  <p className="font-medium text-gray-900">{entry.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={clsx(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    entry.status === 'active' ? 'bg-green-100 text-green-800' :
                    entry.status === 'upgraded' ? 'bg-blue-100 text-blue-800' :
                    entry.status === 'downgraded' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  )}>
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Billing Period</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(entry.startDate), 'MMM dd')} - {format(new Date(entry.endDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium text-gray-900">£{entry.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            {entry.invoiceNumber && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Billing Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Invoice Number</p>
                    <p className="font-medium text-gray-900">{entry.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium text-gray-900">{entry.paymentMethod || 'Card ending ****4242'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Changes History */}
            {entry.changes && entry.changes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Changes During Period</h3>
                <div className="space-y-2">
                  {entry.changes.map((change, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {change.from} → {change.to}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{change.reason}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {format(new Date(change.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                <FileText className="w-4 h-4 mr-2" />
                View Full Statement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SubscriptionInfo: React.FC = () => {
  const { currentCustomer } = useCustomer();
  const { user } = useAuth();
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [targetPlan, setTargetPlan] = useState('');
  const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriptionChange[]>([]);
  const [expandedHistory, setExpandedHistory] = useState(false);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<SubscriptionHistoryEntry | null>(null);
  const [showHistoryDetails, setShowHistoryDetails] = useState(false);

  // Generate mock subscription history for last 12 months
  const mockSubscriptionHistory = useMemo((): SubscriptionHistoryEntry[] => {
    const history: SubscriptionHistoryEntry[] = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const startDate = subMonths(currentDate, i + 1);
      const endDate = subMonths(currentDate, i);
      
      // Determine plan and status based on month
      let plan = 'Nest Aware Plus';
      let status: SubscriptionHistoryEntry['status'] = 'active';
      let amount = 10;
      const changes: SubscriptionHistoryEntry['changes'] = [];
      
      if (i === 3) {
        // Downgrade 3 months ago
        status = 'downgraded';
        plan = 'Nest Aware';
        amount = 5;
        changes.push({
          date: addDays(startDate, 15).toISOString(),
          from: 'Nest Aware Plus',
          to: 'Nest Aware',
          reason: 'Customer requested downgrade via self-service'
        });
      } else if (i === 8) {
        // Upgrade 8 months ago
        status = 'upgraded';
        changes.push({
          date: addDays(startDate, 10).toISOString(),
          from: 'Nest Aware',
          to: 'Nest Aware Plus',
          reason: 'Customer upgraded for 24/7 recording feature'
        });
      } else if (i > 3 && i < 8) {
        plan = 'Nest Aware';
        amount = 5;
      } else if (i >= 8) {
        plan = 'Nest Aware';
        amount = 5;
      }
      
      history.push({
        id: `sub-${i}`,
        period: format(startDate, 'MMMM yyyy'),
        plan,
        status,
        amount,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        invoiceNumber: `INV-2024${String(12 - i).padStart(2, '0')}-${Math.floor(Math.random() * 10000)}`,
        paymentMethod: 'Card ending ****4242',
        changes: changes.length > 0 ? changes : undefined
      });
    }
    
    return history;
  }, []);

  if (!currentCustomer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No customer selected</p>
          <p className="text-sm text-gray-500">Search for a customer to view subscription information</p>
        </div>
      </div>
    );
  }

  const handlePlanChange = (newPlan: string) => {
    setTargetPlan(newPlan);
    setShowChangeModal(true);
  };

  const handleConfirmChange = (reason: string, details?: string) => {
    const change: SubscriptionChange = {
      id: Date.now().toString(),
      fromPlan: currentCustomer.subscription.plan,
      toPlan: targetPlan,
      reason: reason === 'other' ? details || reason : reason,
      agentId: user?.id || '',
      timestamp: new Date().toISOString()
    };

    setSubscriptionHistory(prev => [change, ...prev.slice(0, 2)]);
    setShowChangeModal(false);
    setTargetPlan('');
  };

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'nest aware plus':
      case 'pro':
        return 'bg-purple-100 text-purple-800';
      case 'nest aware':
      case 'plus':
        return 'bg-blue-100 text-blue-800';
      case 'free':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'downgraded':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription Information</h1>
        <p className="text-gray-600">Manage customer subscription and billing details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Subscription */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Subscription</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Plan</span>
              <span className={clsx(
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                getPlanColor(currentCustomer.subscription.plan)
              )}>
                {currentCustomer.subscription.plan === 'plus' ? 'Nest Aware' : 
                 currentCustomer.subscription.plan === 'pro' ? 'Nest Aware Plus' :
                 currentCustomer.subscription.plan.charAt(0).toUpperCase() + currentCustomer.subscription.plan.slice(1)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Status</span>
              <span className={clsx(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusColor(currentCustomer.subscription.status)
              )}>
                {currentCustomer.subscription.status === 'downgraded' ? (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Downgraded
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {currentCustomer.subscription.status}
                  </>
                )}
              </span>
            </div>

            {currentCustomer.subscription.status === 'downgraded' && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <Info className="w-4 h-4 inline mr-1" />
                  Will change to Free plan on next billing cycle
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Start Date
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {format(new Date(currentCustomer.subscription.startDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Next Renewal
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {format(new Date(currentCustomer.subscription.nextRenewal), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Last Payment
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {format(new Date(currentCustomer.subscription.lastPayment), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>

        {/* Plan Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Plan Management</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Plan changes require justification
              </p>
              <p className="text-xs text-yellow-700">
                All subscription modifications are logged for audit purposes
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">O2 Smart Home Plans</h3>
              
              {['Free', 'Nest Aware', 'Nest Aware Plus'].map((plan) => (
                <div
                  key={plan}
                  className={clsx(
                    'flex items-center justify-between p-3 border rounded-lg',
                    ((currentCustomer.subscription.plan === 'plus' && plan === 'Nest Aware') ||
                     (currentCustomer.subscription.plan === 'pro' && plan === 'Nest Aware Plus') ||
                     (currentCustomer.subscription.plan === 'free' && plan === 'Free'))
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div>
                    <p className="font-medium text-gray-900">{plan}</p>
                    <p className="text-xs text-gray-500">
                      {plan === 'Free' && 'Basic live streaming only'}
                      {plan === 'Nest Aware' && '£5/month - 30 days event history'}
                      {plan === 'Nest Aware Plus' && '£10/month - 60 days + 24/7 recording'}
                    </p>
                  </div>
                  {(currentCustomer.subscription.plan === 'plus' && plan === 'Nest Aware') ||
                   (currentCustomer.subscription.plan === 'pro' && plan === 'Nest Aware Plus') ||
                   (currentCustomer.subscription.plan === 'free' && plan === 'Free') ? (
                    <span className="text-sm text-blue-600 font-medium">Current</span>
                  ) : (
                    <button
                      onClick={() => handlePlanChange(plan)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Change
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nest Aware Benefits */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nest Aware Subscription Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Free Tier */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Free</h3>
              <p className="text-sm text-gray-600 mb-4">Basic features included</p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Live video streaming</span>
                </li>
                <li className="flex items-start space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>3 hours of event video history</span>
                </li>
                <li className="flex items-start space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Person alerts</span>
                </li>
                <li className="flex items-start space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Sound detection</span>
                </li>
              </ul>
            </div>

            {/* Nest Aware */}
            <div className="border-2 border-blue-300 rounded-lg p-4 relative">
              <div className="absolute -top-3 left-4 bg-white px-2">
                <span className="text-xs font-semibold text-blue-600">RECOMMENDED</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Nest Aware</h3>
              <p className="text-lg font-bold text-gray-900 mb-3">£5/month</p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>30 days</strong> of event video history</span>
                </li>
                <li className="flex items-start space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Intelligent alerts (package, vehicle, animal)</span>
                </li>
                <li className="flex items-start space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Activity zones</span>
                </li>
                <li className="flex items-start space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Create & share clips</span>
                </li>
                <li className="flex items-start space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>e911 emergency calling (US)</span>
                </li>
              </ul>
            </div>

            {/* Nest Aware Plus */}
            <div className="border border-purple-300 bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">Nest Aware Plus</h3>
              <p className="text-lg font-bold text-gray-900 mb-3">£10/month</p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2 text-sm text-gray-600">
                  <Zap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span><strong>60 days</strong> of event video history</span>
                </li>
                <li className="flex items-start space-x-2 text-sm text-gray-600">
                  <Zap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span><strong>10 days</strong> of 24/7 video history</span>
                </li>
                <li className="flex items-start space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>All Nest Aware features</span>
                </li>
                <li className="flex items-start space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Video className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-900">Video History</p>
              <p className="text-xs text-gray-600">Save important moments</p>
            </div>
            <div className="text-center">
              <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-900">Smart Alerts</p>
              <p className="text-xs text-gray-600">Know what matters</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-900">Familiar Faces</p>
              <p className="text-xs text-gray-600">Recognize family</p>
            </div>
            <div className="text-center">
              <Cloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-900">Cloud Storage</p>
              <p className="text-xs text-gray-600">Secure backup</p>
            </div>
          </div>
        </div>

        {/* Subscription History - Last 12 Months */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <History className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Subscription History</h2>
              <span className="text-sm text-gray-500">Last 12 Months</span>
            </div>
            <button
              onClick={() => setExpandedHistory(!expandedHistory)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <span>{expandedHistory ? 'Show Less' : 'Show All'}</span>
              {expandedHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="space-y-3">
            {mockSubscriptionHistory.slice(0, expandedHistory ? undefined : 3).map((entry) => (
              <div 
                key={entry.id} 
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedHistoryEntry(entry);
                  setShowHistoryDetails(true);
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{entry.period}</p>
                    <p className="text-sm text-gray-600">{entry.plan}</p>
                  </div>
                  {entry.status === 'upgraded' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Upgraded
                    </span>
                  )}
                  {entry.status === 'downgraded' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      Downgraded
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">£{entry.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">per month</p>
                  </div>
                  <button 
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHistoryEntry(entry);
                      setShowHistoryDetails(true);
                    }}
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  £{mockSubscriptionHistory.reduce((sum, entry) => sum + entry.amount, 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Spent (12 months)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {mockSubscriptionHistory.filter(e => e.status === 'upgraded' || e.status === 'downgraded').length}
                </p>
                <p className="text-sm text-gray-600">Plan Changes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  £{(mockSubscriptionHistory.reduce((sum, entry) => sum + entry.amount, 0) / 12).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Average Monthly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Changes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Changes</h2>
          
          {subscriptionHistory.length > 0 ? (
            <div className="space-y-3">
              {subscriptionHistory.map((change) => (
                <div key={change.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Edit3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {change.fromPlan} → {change.toPlan}
                      </p>
                      <p className="text-xs text-gray-500">
                        {change.reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {format(new Date(change.timestamp), 'MMM dd, HH:mm')}
                    </p>
                    <p className="text-xs text-gray-400">
                      Agent: {change.agentId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No recent subscription changes</p>
            </div>
          )}
        </div>
      </div>

      <SubscriptionChangeModal
        isOpen={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        onConfirm={handleConfirmChange}
        currentPlan={currentCustomer.subscription.plan}
        targetPlan={targetPlan}
      />

      <HistoryDetailsModal
        isOpen={showHistoryDetails}
        onClose={() => setShowHistoryDetails(false)}
        entry={selectedHistoryEntry}
      />
    </div>
  );
};