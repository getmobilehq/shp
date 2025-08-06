import React, { useEffect, useState } from 'react';
import { useCustomer } from '../hooks/useCustomer';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Wifi, 
  WifiOff, 
  Router,
  Thermometer,
  Camera,
  DoorOpen,
  Gauge,
  Activity,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Calendar,
  CreditCard,
  ExternalLink,
  Info,
  Shield
} from 'lucide-react';
import { Device } from '../types';
import { format } from 'date-fns';
import clsx from 'clsx';

const getDeviceIcon = (type: Device['type']) => {
  switch (type) {
    case 'thermostat':
      return Thermometer;
    case 'camera':
      return Camera;
    case 'doorbell':
      return DoorOpen;
    case 'sensor':
      return Gauge;
    case 'hub':
      return Router;
    default:
      return Activity;
  }
};

const getConnectivityColor = (status: string) => {
  switch (status) {
    case 'good':
      return 'text-green-600 bg-green-100 border-green-200';
    case 'weak':
      return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    case 'down':
      return 'text-red-600 bg-red-100 border-red-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};

const getConnectivityLabel = (status: string) => {
  switch (status) {
    case 'good':
      return 'Good';
    case 'weak':
      return 'Weak Wi-Fi';
    case 'down':
      return 'Internet Down';
    default:
      return 'Unknown';
  }
};

const getPlanColor = (plan: string) => {
  switch (plan.toLowerCase()) {
    case 'nest aware plus':
    case 'pro':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'nest aware':
    case 'plus':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'free':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPlanBenefits = (plan: string) => {
  switch (plan.toLowerCase()) {
    case 'nest aware plus':
    case 'pro':
      return '£10/month - 60 days event history + 24/7 recording + priority support';
    case 'nest aware':
    case 'plus':
      return '£5/month - 30 days event history + intelligent alerts + activity zones';
    case 'free':
      return 'Basic live streaming + 3 hours event history + person alerts';
    default:
      return 'Plan benefits unavailable';
  }
};

export const CustomerOverview: React.FC = () => {
  const { currentCustomer } = useCustomer();
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConnectivityInfo, setShowConnectivityInfo] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  if (!currentCustomer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No customer selected</p>
          <p className="text-sm text-gray-500">Search for a customer to view their overview</p>
        </div>
      </div>
    );
  }

  const offlineDevices = currentCustomer?.devices?.filter(device => device.status === 'offline') || [];
  const onlineDevices = currentCustomer?.devices?.filter(device => device.status === 'online') || [];
  const connectivityStatus = currentCustomer?.connectivity?.status || 'unknown';
  const isCriticalConnectivity = connectivityStatus === 'down';

  return (
    <div className="space-y-6 p-6">
      {/* Header with refresh controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Overview</h1>
          <p className="text-gray-600">Complete view of customer account and Smart Home devices</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={clsx('w-4 h-4', isRefreshing && 'animate-spin')} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Critical connectivity alert */}
      {isCriticalConnectivity && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Critical Connectivity Issue</h3>
              <p className="text-red-700">Customer's internet connection is down. All Smart Home devices may be affected.</p>
            </div>
          </div>
        </div>
      )}

      {/* Four-section grid - designed to fit above the fold */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}>
        
        {/* Device Holdings & RSI Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Device Holdings & RSI Status</h2>
            <div className="flex items-center space-x-4">
              {/* Toggle for connectivity info */}
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!showConnectivityInfo}
                  onChange={(e) => setShowConnectivityInfo(!e.target.checked)}
                  className="sr-only"
                />
                <div className="relative">
                  <div className={clsx(
                    "block w-10 h-6 rounded-full transition-colors",
                    showConnectivityInfo ? "bg-gray-300" : "bg-blue-600"
                  )}></div>
                  <div className={clsx(
                    "absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform",
                    showConnectivityInfo ? "" : "translate-x-4"
                  )}></div>
                </div>
                <span className="ml-2 text-sm text-gray-700">No Connectivity Info</span>
              </label>
              
              {/* Connectivity badges - only show when toggle is off */}
              {showConnectivityInfo && (
                <div className="flex items-center space-x-2">
                  {offlineDevices.length > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {offlineDevices.length} Offline
                    </span>
                  )}
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {onlineDevices.length} Online
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Device summary stats */}
          <div className={clsx(
            "grid gap-4 mb-4 p-3 bg-gray-50 rounded-lg",
            showConnectivityInfo ? "grid-cols-3" : "grid-cols-1"
          )}>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{currentCustomer?.devices?.length || 0}</p>
              <p className="text-sm text-gray-600">Total Devices</p>
            </div>
            {showConnectivityInfo && (
              <>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{onlineDevices.length}</p>
                  <p className="text-sm text-gray-600">Online</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{offlineDevices.length}</p>
                  <p className="text-sm text-gray-600">Offline</p>
                </div>
              </>
            )}
          </div>

          {/* Device list */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {(currentCustomer?.devices || []).map((device) => {
              const IconComponent = getDeviceIcon(device.type);
              const isOffline = device.status === 'offline';
              
              return (
                <div 
                  key={device.id} 
                  className={clsx(
                    'flex items-center justify-between p-3 rounded-lg border',
                    showConnectivityInfo && isOffline ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={clsx('w-5 h-5', showConnectivityInfo && isOffline ? 'text-red-600' : 'text-gray-600')} />
                    <div>
                      <p className={clsx('font-medium', showConnectivityInfo && isOffline ? 'text-red-900' : 'text-gray-900')}>
                        {device.name}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{device.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {showConnectivityInfo && (
                      <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        device.status === 'online' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      )}>
                        {device.status === 'online' ? (
                          <Wifi className="w-3 h-3 mr-1" />
                        ) : (
                          <WifiOff className="w-3 h-3 mr-1" />
                        )}
                        {device.status}
                      </span>
                    )}
                    {showConnectivityInfo && device.rssi && (
                      <span className="text-xs text-gray-500">
                        {device.rssi}dBm
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Account Profile & Address Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Profile & Address</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{currentCustomer?.name}</p>
                <p className="text-sm text-gray-500">Customer ID: {currentCustomer?.id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{currentCustomer?.email}</p>
                <p className="text-sm text-gray-500">Account email</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{currentCustomer?.phone}</p>
                <p className="text-sm text-gray-500">Primary contact</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Service Address</p>
                <p className="text-sm text-gray-600">
                  {currentCustomer?.address?.street}<br />
                  {currentCustomer?.address?.city}<br />
                  {currentCustomer?.address?.postcode}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Account Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">DPA Verified</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Tier Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Subscription Tier</h2>
            <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
              <span>View Details</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Plan tier badge */}
            <div className="text-center">
              <div className={clsx(
                'inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold border-2',
                getPlanColor(currentCustomer?.subscription?.plan || 'free')
              )}>
                {currentCustomer?.subscription?.plan === 'plus' ? 'NEST AWARE' : 
                 currentCustomer?.subscription?.plan === 'pro' ? 'NEST AWARE PLUS' :
                 (currentCustomer?.subscription?.plan || 'free').toUpperCase()}
              </div>
              <p className="text-sm text-gray-600 mt-2">Current Plan</p>
            </div>

            {/* Plan benefits tooltip */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Plan Benefits</p>
                  <p className="text-xs text-blue-700 mt-1">
                    {getPlanBenefits(currentCustomer?.subscription?.plan || 'free')}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscription details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <p className="text-sm font-medium text-gray-900">Start Date</p>
                </div>
                <p className="text-sm text-gray-600">
                  {currentCustomer?.subscription?.startDate ? format(new Date(currentCustomer.subscription.startDate), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <p className="text-sm font-medium text-gray-900">Renewal</p>
                </div>
                <p className="text-sm text-gray-600">
                  {currentCustomer?.subscription?.nextRenewal ? format(new Date(currentCustomer.subscription.nextRenewal), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-1">
                <CreditCard className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-900">Last Payment</p>
              </div>
              <p className="text-sm text-gray-600">
                {currentCustomer?.subscription?.lastPayment ? format(new Date(currentCustomer.subscription.lastPayment), 'MMM dd, yyyy') : 'N/A'}
              </p>
            </div>

            {/* Status indicator */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Billing Status</span>
                <span className={clsx(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  (currentCustomer?.subscription?.status || 'cancelled') === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : (currentCustomer?.subscription?.status || 'cancelled') === 'downgraded'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-red-100 text-red-800'
                )}>
                  {(currentCustomer?.subscription?.status || 'cancelled') === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {(currentCustomer?.subscription?.status || 'cancelled') === 'downgraded' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {((currentCustomer?.subscription?.status || 'cancelled').charAt(0).toUpperCase() + (currentCustomer?.subscription?.status || 'cancelled').slice(1))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Connectivity Health - Only show when connectivity info is enabled */}
        {showConnectivityInfo ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Connectivity Health</h2>
          
          <div className="space-y-4">
            {/* Main status indicator */}
            <div className="text-center">
              <div className={clsx(
                'inline-flex items-center px-4 py-3 rounded-lg text-lg font-semibold border-2',
                getConnectivityColor(connectivityStatus)
              )}>
                {connectivityStatus === 'good' && <Wifi className="w-6 h-6 mr-2" />}
                {connectivityStatus === 'weak' && <Wifi className="w-6 h-6 mr-2" />}
                {connectivityStatus === 'down' && <WifiOff className="w-6 h-6 mr-2" />}
                {getConnectivityLabel(connectivityStatus)}
              </div>
              <p className="text-sm text-gray-600 mt-2">Network Status</p>
            </div>

            {/* Detailed metrics */}
            {currentCustomer?.connectivity && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Signal Strength</span>
                  <span className="text-sm text-gray-600">{currentCustomer.connectivity.signalStrength}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={clsx(
                      'h-2 rounded-full transition-all duration-300',
                      currentCustomer.connectivity.signalStrength >= 80 
                        ? 'bg-green-600' 
                        : currentCustomer.connectivity.signalStrength >= 50 
                        ? 'bg-yellow-600' 
                        : 'bg-red-600'
                    )}
                    style={{ width: `${currentCustomer.connectivity.signalStrength}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Download</p>
                    <p className="text-sm text-gray-600">{currentCustomer.connectivity.downloadSpeed} Mbps</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Upload</p>
                    <p className="text-sm text-gray-600">{currentCustomer.connectivity.uploadSpeed} Mbps</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">Last Speed Test</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(currentCustomer.connectivity.lastSpeedTest), 'MMM dd, HH:mm')}
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Run Network Diagnostic
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                View Connection History
              </button>
            </div>
          </div>
        </div>
        ) : (
          // Placeholder div to maintain grid layout when connectivity card is hidden
          <div></div>
        )}
      </div>
    </div>
  );
};