export interface User {
  id: string;
  name: string;
  email: string;
  role: 'tier1' | 'tier2' | 'admin';
  permissions: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postcode: string;
  };
  verified: boolean;
  subscription: Subscription;
  devices: Device[];
  connectivity: ConnectivityStatus;
}

export interface Subscription {
  id: string;
  plan: 'free' | 'plus' | 'pro';
  status: 'active' | 'downgraded' | 'cancelled';
  startDate: string;
  nextRenewal: string;
  lastPayment: string;
  history: SubscriptionChange[];
}

export interface SubscriptionChange {
  id: string;
  fromPlan: string;
  toPlan: string;
  reason: string;
  agentId: string;
  timestamp: string;
}

export interface Device {
  id: string;
  name: string;
  location: string;
  type: 'thermostat' | 'camera' | 'doorbell' | 'sensor' | 'hub';
  status: 'online' | 'offline' | 'maintenance';
  lastSeen: string;
  rssi: number;
}

export interface ConnectivityStatus {
  status: 'good' | 'weak' | 'down';
  signalStrength: number;
  downloadSpeed: number;
  uploadSpeed: number;
  lastSpeedTest: string;
}

export interface DPAAttempt {
  id: string;
  customerId: string;
  agentId: string;
  result: 'pass' | 'fail' | 'override';
  reason?: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  action: string;
  agentId: string;
  customerId?: string;
  details: Record<string, unknown>;
  timestamp: string;
}