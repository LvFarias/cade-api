export interface TrackingEvent {
  status: string;
  description: string;
  location?: string;
  occurredAt: Date;
}

export interface TrackingResult {
  currentStatus: string;
  currentDescription: string;
  history: TrackingEvent[];
}

export interface ProviderPlugin {
  getTracking(trackingCode: string, document?: string): Promise<TrackingResult>;
}