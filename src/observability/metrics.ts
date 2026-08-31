/**
 * Long-Term Production Capacity & Operational Metrics Thresholds for BatuTV.
 */

export interface CapacityThresholds {
  warningPercent: number;
  criticalPercent: number;
  maxRecommendedDocuments: Record<string, number>;
  maxDailyActiveSubscriptions: number;
  maxP95LatencyMs: number;
  maxErrorRatePercent: number;
}

export const PRODUCTION_CAPACITY_CONFIG: CapacityThresholds = {
  warningPercent: 70,
  criticalPercent: 85,
  maxRecommendedDocuments: {
    articles: 100000,
    videos: 50000,
    categories: 500,
    tags: 10000,
    authors: 1000,
    media: 500000,
    pages: 200,
    navigation: 100,
    users: 500,
    activity_logs: 1000000,
  },
  maxDailyActiveSubscriptions: 200,
  maxP95LatencyMs: 500,
  maxErrorRatePercent: 1.0,
};

export interface RetentionPolicy {
  hotDays: number;
  warmDays: number;
  archiveDays: number;
  purgeDays: number;
  dryRun: boolean;
}

export const DATA_RETENTION_POLICY: RetentionPolicy = {
  hotDays: 30,
  warmDays: 90,
  archiveDays: 365,
  purgeDays: 730,
  dryRun: true,
};
