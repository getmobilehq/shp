import React, { useState } from 'react';
import { useCustomer } from '../hooks/useCustomer';
import { Stethoscope, ExternalLink, Wifi, WifiOff, Activity, CheckCircle, AlertTriangle, RefreshCw, Clock } from 'lucide-react';

export const Diagnostics: React.FC = () => {
  const { currentCustomer } = useCustomer();
  const [runningTest, setRunningTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, 'pass' | 'fail' | 'pending'>>({
    connectivity: 'pending',
    devices: 'pending',
    speed: 'pending',
    security: 'pending'
  });

  const runDiagnostic = async (testType: string) => {
    setRunningTest(testType);
    setTestResults(prev => ({ ...prev, [testType]: 'pending' }));
    
    // Simulate diagnostic test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Random pass/fail for demo
    const result = Math.random() > 0.3 ? 'pass' : 'fail';
    setTestResults(prev => ({ ...prev, [testType]: result }));
    setRunningTest(null);
  };

  const runAllDiagnostics = async () => {
    const tests = ['connectivity', 'devices', 'speed', 'security'];
    for (const test of tests) {
      await runDiagnostic(test);
    }
  };

  if (!currentCustomer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No customer selected</p>
          <p className="text-sm text-gray-500">Search for a customer to run diagnostics</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: 'pass' | 'fail' | 'pending') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'pending') => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 h-full p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diagnostics Console</h1>
          <p className="text-gray-600">System diagnostics for {currentCustomer.name}</p>
        </div>
        <a
          href="https://support.google.com/googlenest"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Google Support</span>
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="p-6">
          {/* Customer Status Overview */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Network Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border ${currentCustomer.connectivity?.status === 'good' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center space-x-3">
                  {currentCustomer.connectivity?.status === 'good' ? (
                    <Wifi className="w-6 h-6 text-green-600" />
                  ) : (
                    <WifiOff className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Connection Status</p>
                    <p className="text-sm text-gray-600 capitalize">{currentCustomer.connectivity?.status || 'Unknown'}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                <div className="flex items-center space-x-3">
                  <Activity className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Signal Strength</p>
                    <p className="text-sm text-gray-600">{currentCustomer.connectivity?.signalStrength || 0}%</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
                <div className="flex items-center space-x-3">
                  <Stethoscope className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Devices Online</p>
                    <p className="text-sm text-gray-600">
                      {currentCustomer.devices.filter(d => d.status === 'online').length} of {currentCustomer.devices.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Tests */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Diagnostic Tests</h2>
              <button
                onClick={runAllDiagnostics}
                disabled={runningTest !== null}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${runningTest ? 'animate-spin' : ''}`} />
                <span>Run All Tests</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Connectivity Test */}
              <div className={`p-4 rounded-lg border ${getStatusColor(testResults.connectivity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(testResults.connectivity)}
                    <h3 className="font-medium text-gray-900">Network Connectivity</h3>
                  </div>
                  <button
                    onClick={() => runDiagnostic('connectivity')}
                    disabled={runningTest !== null}
                    className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    {runningTest === 'connectivity' ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Run'}
                  </button>
                </div>
                <p className="text-sm text-gray-600">Tests internet connection and latency</p>
                {testResults.connectivity === 'fail' && (
                  <p className="text-sm text-red-600 mt-2">High latency detected (&gt;100ms)</p>
                )}
              </div>

              {/* Device Test */}
              <div className={`p-4 rounded-lg border ${getStatusColor(testResults.devices)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(testResults.devices)}
                    <h3 className="font-medium text-gray-900">Device Health</h3>
                  </div>
                  <button
                    onClick={() => runDiagnostic('devices')}
                    disabled={runningTest !== null}
                    className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    {runningTest === 'devices' ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Run'}
                  </button>
                </div>
                <p className="text-sm text-gray-600">Checks all connected device statuses</p>
                {testResults.devices === 'fail' && (
                  <p className="text-sm text-red-600 mt-2">
                    {currentCustomer.devices.filter(d => d.status === 'offline').length} device(s) offline
                  </p>
                )}
              </div>

              {/* Speed Test */}
              <div className={`p-4 rounded-lg border ${getStatusColor(testResults.speed)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(testResults.speed)}
                    <h3 className="font-medium text-gray-900">Speed Test</h3>
                  </div>
                  <button
                    onClick={() => runDiagnostic('speed')}
                    disabled={runningTest !== null}
                    className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    {runningTest === 'speed' ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Run'}
                  </button>
                </div>
                <p className="text-sm text-gray-600">Measures download/upload speeds</p>
                {testResults.speed === 'pass' && (
                  <p className="text-sm text-green-600 mt-2">
                    {currentCustomer.connectivity?.downloadSpeed || 0} Mbps down / {currentCustomer.connectivity?.uploadSpeed || 0} Mbps up
                  </p>
                )}
              </div>

              {/* Security Test */}
              <div className={`p-4 rounded-lg border ${getStatusColor(testResults.security)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(testResults.security)}
                    <h3 className="font-medium text-gray-900">Security Check</h3>
                  </div>
                  <button
                    onClick={() => runDiagnostic('security')}
                    disabled={runningTest !== null}
                    className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    {runningTest === 'security' ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Run'}
                  </button>
                </div>
                <p className="text-sm text-gray-600">Verifies network security settings</p>
                {testResults.security === 'pass' && (
                  <p className="text-sm text-green-600 mt-2">All security protocols active</p>
                )}
              </div>
            </div>
          </div>

          {/* Device Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Details</h2>
            <div className="space-y-3">
              {currentCustomer.devices.map((device) => (
                <div
                  key={device.id}
                  className={`p-4 rounded-lg border ${
                    device.status === 'online' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {device.status === 'online' ? (
                        <Wifi className="w-5 h-5 text-green-600" />
                      ) : (
                        <WifiOff className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{device.name}</p>
                        <p className="text-sm text-gray-600">
                          {device.location} • {device.type} • RSSI: {device.rssi}dBm
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      device.status === 'online' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {device.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};