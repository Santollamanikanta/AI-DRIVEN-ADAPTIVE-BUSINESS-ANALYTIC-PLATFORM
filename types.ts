

export type NavItem = 'Dashboard' | 'Data Hub' | 'Analytics' | 'CRM';

export interface ChartData {
  name: string;
  value: number;
}

export interface SalesRecord {
  [key: string]: string | number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  lastPurchase: string;
}

// Fix: Add global type definition for window.aistudio to be used for API key selection.
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    }
  }
}
