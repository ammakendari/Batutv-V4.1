/**
 * BatuTV News Portal & CMS — Continuous Production Operational Runbooks
 * Standard Operating Procedures (SOP) for Incident Response and Disaster Recovery.
 */

export interface IncidentProcedure {
  incidentId: string;
  title: string;
  severity: 'P0' | 'P1' | 'P2';
  detectionSignal: string;
  steps: Array<{
    stepNumber: number;
    phase: 'DETECT' | 'ISOLATE' | 'MITIGATE' | 'RECOVER' | 'VERIFY';
    action: string;
    commandOrTool?: string;
  }>;
  verificationCriteria: string;
  rtoTargetMinutes: number;
}

export const OPERATIONAL_RUNBOOKS: Record<string, IncidentProcedure> = {
  FIRESTORE_OUTAGE: {
    incidentId: 'INC-01',
    title: 'Incident: Firestore Unavailable / High Error Rate',
    severity: 'P0',
    detectionSignal: 'HTTP 503 spike, Firestore error rate > 0.1%, or health check degraded',
    steps: [
      {
        stepNumber: 1,
        phase: 'DETECT',
        action: 'Inspect /health and /ready endpoints to assess Firestore connectivity status.',
        commandOrTool: 'curl -s https://[APP_DOMAIN]/health',
      },
      {
        stepNumber: 2,
        phase: 'ISOLATE',
        action: 'System automatically activates read-through LocalStorage cache fallback for public readers.',
      },
      {
        stepNumber: 3,
        phase: 'MITIGATE',
        action: 'CMS admin write operations are temporarily held with user-friendly retryable notification.',
      },
      {
        stepNumber: 4,
        phase: 'RECOVER',
        action: 'Once Google Cloud Firestore status is normal, initiate resynchronization.',
        commandOrTool: 'npm run audit:integrity',
      },
      {
        stepNumber: 5,
        phase: 'VERIFY',
        action: 'Verify Firestore realtime subscriptions and snapshot reconciliation.',
      },
    ],
    verificationCriteria: 'Firestore read/write success rate >= 99.9% and health status "ok".',
    rtoTargetMinutes: 15,
  },

  AUTH_SERVICE_DOWN: {
    incidentId: 'INC-02',
    title: 'Incident: Firebase Authentication Service Outage',
    severity: 'P0',
    detectionSignal: 'Auth failure rate > 0.5%, token verification timeouts',
    steps: [
      {
        stepNumber: 1,
        phase: 'DETECT',
        action: 'Detect recurring auth/network-request-failed or auth/internal-error in logger.',
      },
      {
        stepNumber: 2,
        phase: 'ISOLATE',
        action: 'Preserve public reader access (all published articles/videos remain readable).',
      },
      {
        stepNumber: 3,
        phase: 'MITIGATE',
        action: 'Display graceful maintenance notification on login panel without revealing error traces.',
      },
      {
        stepNumber: 4,
        phase: 'RECOVER',
        action: 'Re-authenticate administrative sessions upon Firebase Auth restoration.',
      },
      {
        stepNumber: 5,
        phase: 'VERIFY',
        action: 'Execute RBAC validation suite to ensure role claims remain intact.',
        commandOrTool: 'npm run audit:integrity',
      },
    ],
    verificationCriteria: 'Admin login succeeds and Custom Claims RBAC validated.',
    rtoTargetMinutes: 15,
  },

  DATA_CORRUPTION_OR_LOSS: {
    incidentId: 'INC-03',
    title: 'Incident: Accidental Deletion or Schema Corruption',
    severity: 'P0',
    detectionSignal: 'Missing collections, orphan foreign keys, or failed singleton validation',
    steps: [
      {
        stepNumber: 1,
        phase: 'DETECT',
        action: 'Run backup & collection verification to pinpoint corrupted documents.',
        commandOrTool: 'npm run backup:verify',
      },
      {
        stepNumber: 2,
        phase: 'ISOLATE',
        action: 'Temporarily lock administrative write access to prevent cascade corruption.',
      },
      {
        stepNumber: 3,
        phase: 'MITIGATE',
        action: 'Identify latest verified snapshot from Cloud Storage backup bucket (RPO <= 24h).',
      },
      {
        stepNumber: 4,
        phase: 'RECOVER',
        action: 'Restore affected collections to staging/production target.',
        commandOrTool: 'gcloud firestore import gs://[BUCKET_NAME]/[EXPORT_PREFIX]',
      },
      {
        stepNumber: 5,
        phase: 'VERIFY',
        action: 'Run full integrity audit to verify 0 orphan references and 0 duplicate IDs.',
        commandOrTool: 'npm run audit:integrity',
      },
    ],
    verificationCriteria: '14 canonical collections verified, singletons intact, 0 orphan FKs.',
    rtoTargetMinutes: 30,
  },

  CREDENTIAL_LEAK_RESPONSE: {
    incidentId: 'INC-04',
    title: 'Incident: Potential Secret or Credential Exposure',
    severity: 'P0',
    detectionSignal: 'Unauthorized administrative activity log or secret scan flag',
    steps: [
      {
        stepNumber: 1,
        phase: 'DETECT',
        action: 'Scan codebase and bundle artifacts for exposed keys.',
        commandOrTool: 'npm run audit:production',
      },
      {
        stepNumber: 2,
        phase: 'ISOLATE',
        action: 'Immediately revoke compromised API keys or service account credentials in Google Cloud IAM.',
      },
      {
        stepNumber: 3,
        phase: 'MITIGATE',
        action: 'Rotate Firebase Admin keys, update environment configuration, and force token revocation.',
      },
      {
        stepNumber: 4,
        phase: 'RECOVER',
        action: 'Redeploy application with rotated keys.',
      },
      {
        stepNumber: 5,
        phase: 'VERIFY',
        action: 'Verify that dist bundle contains 0 exposed credentials.',
      },
    ],
    verificationCriteria: 'Zero secrets in client bundle, all revoked tokens rejected.',
    rtoTargetMinutes: 20,
  },
};
