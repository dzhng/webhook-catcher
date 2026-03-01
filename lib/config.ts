const DEFAULT_QUEUE_REGION = "iad1";
const DEFAULT_EVENT_RETENTION_SECONDS = 60 * 60 * 24;
const DEFAULT_MAX_CAPTURE_BYTES = 64 * 1024;

export interface AppConfig {
  queueRegion: string;
  queueToken?: string;
  eventRetentionSeconds: number;
  maxCaptureBytes: number;
}

let cachedConfig: AppConfig | null = null;

function parseInteger(
  name: string,
  fallback: number,
  options: { min: number; max?: number },
): number {
  const rawValue = process.env[name];
  if (!rawValue) {
    return fallback;
  }

  const parsed = Number.parseInt(rawValue, 10);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${name} must be an integer.`);
  }

  if (parsed < options.min) {
    throw new Error(`${name} must be >= ${options.min}.`);
  }

  if (typeof options.max === "number" && parsed > options.max) {
    throw new Error(`${name} must be <= ${options.max}.`);
  }

  return parsed;
}

export function getConfig(): AppConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  cachedConfig = {
    queueRegion:
      process.env.WEBHOOK_CATCHER_QUEUE_REGION ??
      process.env.VERCEL_REGION ??
      DEFAULT_QUEUE_REGION,
    queueToken: process.env.WEBHOOK_CATCHER_QUEUE_TOKEN,
    eventRetentionSeconds: parseInteger(
      "WEBHOOK_CATCHER_EVENT_RETENTION_SECONDS",
      DEFAULT_EVENT_RETENTION_SECONDS,
      { min: 60, max: 86400 },
    ),
    maxCaptureBytes: parseInteger(
      "WEBHOOK_CATCHER_MAX_CAPTURE_BYTES",
      DEFAULT_MAX_CAPTURE_BYTES,
      { min: 1024, max: 1024 * 1024 },
    ),
  };

  return cachedConfig;
}
