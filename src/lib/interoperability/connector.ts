// ─── Interoperability Connector Framework ───────────────────────
// Reusable connectors for legacy and modern government systems

export interface ConnectorConfig {
  id: string;
  name: string;
  department: string;
  endpoint: string;
  authType: "api_key" | "oauth2" | "saml" | "certificate" | "mock";
  dataFormat: "json" | "xml" | "soap" | "rest";
  version: string;
  timeout: number;
  retryPolicy: RetryPolicy;
  circuitBreaker: CircuitBreakerConfig;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffMs: number;
  maxBackoffMs: number;
  retryableStatuses: number[];
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeoutMs: number;
  halfOpenMaxCalls: number;
}

export interface ConnectorResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  correlationId: string;
  latencyMs: number;
  source: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface DataPayload {
  source: string;
  target: string;
  format: string;
  data: Record<string, unknown>;
  consentId?: string;
  qualityChecks?: DataQualityCheck[];
}

export interface DataQualityCheck {
  field: string;
  rule: "required" | "format" | "range" | "reference" | "custom";
  value: unknown;
  valid: boolean;
  message?: string;
}

// ─── Circuit Breaker States ────────────────────────────────────

type CircuitState = "closed" | "open" | "half_open";

class CircuitBreaker {
  private state: CircuitState = "closed";
  private failureCount = 0;
  private lastFailureTime = 0;
  private successCount = 0;

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime > this.config.resetTimeoutMs) {
        this.state = "half_open";
        this.successCount = 0;
      } else {
        throw new Error("Circuit breaker is OPEN - service unavailable");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    if (this.state === "half_open") {
      this.successCount++;
      if (this.successCount >= this.config.halfOpenMaxCalls) {
        this.state = "closed";
      }
    }
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.config.failureThreshold) {
      this.state = "open";
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  getFailureCount(): number {
    return this.failureCount;
  }
}

// ─── Base Connector Class ──────────────────────────────────────

export abstract class BaseConnector {
  protected config: ConnectorConfig;
  protected circuitBreaker: CircuitBreaker;
  protected requestLog: Array<{
    timestamp: string;
    correlationId: string;
    status: string;
    latencyMs: number;
  }> = [];

  constructor(config: ConnectorConfig) {
    this.config = config;
    this.circuitBreaker = new CircuitBreaker(config.circuitBreaker);
  }

  async sendRequest<T>(
    payload: DataPayload,
    correlationId: string
  ): Promise<ConnectorResponse<T>> {
    const startTime = Date.now();

    try {
      const result = await this.circuitBreaker.execute(async () => {
        return await this.executeRequest<T>(payload, correlationId);
      });

      const latencyMs = Date.now() - startTime;
      const response: ConnectorResponse<T> = {
        success: true,
        data: result,
        correlationId,
        latencyMs,
        source: this.config.id,
        timestamp: new Date().toISOString(),
      };

      this.logRequest(correlationId, "success", latencyMs);
      return response;
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      const response: ConnectorResponse<T> = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        correlationId,
        latencyMs,
        source: this.config.id,
        timestamp: new Date().toISOString(),
      };

      this.logRequest(correlationId, "failed", latencyMs);
      return response;
    }
  }

  protected abstract executeRequest<T>(
    payload: DataPayload,
    correlationId: string
  ): Promise<T>;

  protected logRequest(
    correlationId: string,
    status: string,
    latencyMs: number
  ) {
    this.requestLog.push({
      timestamp: new Date().toISOString(),
      correlationId,
      status,
      latencyMs,
    });

    // Keep only last 100 requests
    if (this.requestLog.length > 100) {
      this.requestLog = this.requestLog.slice(-100);
    }
  }

  getHealth(): {
    status: string;
    circuitState: string;
    failureCount: number;
    recentRequests: number;
    avgLatency: number;
  } {
    const recent = this.requestLog.slice(-20);
    const avgLatency =
      recent.length > 0
        ? recent.reduce((sum, r) => sum + r.latencyMs, 0) / recent.length
        : 0;

    return {
      status:
        this.circuitBreaker.getState() === "open" ? "offline" : "online",
      circuitState: this.circuitBreaker.getState(),
      failureCount: this.circuitBreaker.getFailureCount(),
      recentRequests: recent.length,
      avgLatency: Math.round(avgLatency),
    };
  }
}

// ─── Mock Connector (for demo) ─────────────────────────────────

export class MockConnector extends BaseConnector {
  private mockDelay: number;

  constructor(config: ConnectorConfig, mockDelay = 200) {
    super(config);
    this.mockDelay = mockDelay;
  }

  protected async executeRequest<T>(
    payload: DataPayload,
    correlationId: string
  ): Promise<T> {
    // Simulate network delay
    await new Promise((resolve) =>
      setTimeout(resolve, this.mockDelay + Math.random() * 100)
    );

    // Simulate occasional failures (5% failure rate)
    if (Math.random() < 0.05) {
      throw new Error(`Service ${this.config.department} temporarily unavailable`);
    }

    // Return mock response
    return {
      correlationId,
      status: "SUBMITTED",
      applicationId: `${this.config.department.substring(0, 2).toUpperCase()}-2026-${10000 + Math.floor(Math.random() * 90000)}`,
      message: `Request processed by ${this.config.name}`,
      timestamp: new Date().toISOString(),
    } as T;
  }
}

// ─── Connector Registry ────────────────────────────────────────

export class ConnectorRegistry {
  private connectors: Map<string, BaseConnector> = new Map();

  register(connector: BaseConnector): void {
    this.connectors.set(connector["config"].id, connector);
  }

  get(id: string): BaseConnector | undefined {
    return this.connectors.get(id);
  }

  getAll(): BaseConnector[] {
    return Array.from(this.connectors.values());
  }

  getHealthStatus(): Array<{
    id: string;
    name: string;
    health: ReturnType<BaseConnector["getHealth"]>;
  }> {
    return this.getAll().map((connector) => ({
      id: connector["config"].id,
      name: connector["config"].name,
      health: connector.getHealth(),
    }));
  }
}

// ─── Default Connector Configurations ──────────────────────────

export const DEFAULT_CONNECTOR_CONFIGS: ConnectorConfig[] = [
  {
    id: "aadhaar-uidai",
    name: "Aadhaar (UIDAI)",
    department: "uidai",
    endpoint: "https://api.uidai.gov.in/v1",
    authType: "certificate",
    dataFormat: "json",
    version: "2.1",
    timeout: 5000,
    retryPolicy: {
      maxRetries: 3,
      backoffMs: 1000,
      maxBackoffMs: 10000,
      retryableStatuses: [408, 429, 500, 502, 503],
    },
    circuitBreaker: {
      failureThreshold: 5,
      resetTimeoutMs: 30000,
      halfOpenMaxCalls: 3,
    },
  },
  {
    id: "pan-nsdl",
    name: "PAN Card (NSDL)",
    department: "incometax",
    endpoint: "https://tin-nsdl.com/api/v1",
    authType: "api_key",
    dataFormat: "json",
    version: "1.5",
    timeout: 8000,
    retryPolicy: {
      maxRetries: 2,
      backoffMs: 2000,
      maxBackoffMs: 15000,
      retryableStatuses: [408, 429, 500],
    },
    circuitBreaker: {
      failureThreshold: 3,
      resetTimeoutMs: 60000,
      halfOpenMaxCalls: 2,
    },
  },
  {
    id: "passport-mea",
    name: "Passport Seva (MEA)",
    department: "passport",
    endpoint: "https://passportindia.gov.in/api/v2",
    authType: "oauth2",
    dataFormat: "json",
    version: "2.0",
    timeout: 10000,
    retryPolicy: {
      maxRetries: 3,
      backoffMs: 1500,
      maxBackoffMs: 20000,
      retryableStatuses: [408, 429, 500, 502],
    },
    circuitBreaker: {
      failureThreshold: 4,
      resetTimeoutMs: 45000,
      halfOpenMaxCalls: 3,
    },
  },
  {
    id: "transport-parivahan",
    name: "Driving License (Parivahan)",
    department: "morth",
    endpoint: "https://parivahan.gov.in/api/v1",
    authType: "oauth2",
    dataFormat: "json",
    version: "1.2",
    timeout: 7000,
    retryPolicy: {
      maxRetries: 2,
      backoffMs: 2000,
      maxBackoffMs: 12000,
      retryableStatuses: [408, 500, 503],
    },
    circuitBreaker: {
      failureThreshold: 5,
      resetTimeoutMs: 30000,
      halfOpenMaxCalls: 2,
    },
  },
  {
    id: "voter-eci",
    name: "Voter ID (NVSP/ECI)",
    department: "eci",
    endpoint: "https://nvsp.in/api/v1",
    authType: "api_key",
    dataFormat: "json",
    version: "1.0",
    timeout: 6000,
    retryPolicy: {
      maxRetries: 2,
      backoffMs: 1000,
      maxBackoffMs: 8000,
      retryableStatuses: [408, 500],
    },
    circuitBreaker: {
      failureThreshold: 3,
      resetTimeoutMs: 20000,
      halfOpenMaxCalls: 2,
    },
  },
  {
    id: "mca-business",
    name: "Business Registration (MCA)",
    department: "mca",
    endpoint: "https://mca.gov.in/api/v1",
    authType: "oauth2",
    dataFormat: "json",
    version: "1.8",
    timeout: 8000,
    retryPolicy: {
      maxRetries: 3,
      backoffMs: 2000,
      maxBackoffMs: 15000,
      retryableStatuses: [408, 429, 500, 502],
    },
    circuitBreaker: {
      failureThreshold: 4,
      resetTimeoutMs: 40000,
      halfOpenMaxCalls: 3,
    },
  },
];
