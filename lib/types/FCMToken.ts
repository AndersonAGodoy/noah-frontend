// lib/types/FCMToken.ts
export interface FCMToken {
  id: string;
  token: string;
  userId?: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    installDate: Date;
  };
  lastActive: Date;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFCMToken {
  token: string;
  userId?: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
  };
}

export interface InstallMetrics {
  totalInstalls: number;
  activeInstalls: number;
  lastUpdated: Date;
  installsByMonth: Record<string, number>;
}
