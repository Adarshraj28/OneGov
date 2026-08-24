// ─── Interoperability Framework ────────────────────────────────
// Main exports for the interoperability middleware layer

export {
  BaseConnector,
  MockConnector,
  ConnectorRegistry,
  DEFAULT_CONNECTOR_CONFIGS,
  type ConnectorConfig,
  type ConnectorResponse,
  type DataPayload,
  type DataQualityCheck,
  type RetryPolicy,
  type CircuitBreakerConfig,
} from "./connector";

export {
  ConsentManager,
  DEPARTMENT_DATA_REQUIREMENTS,
  SENSITIVE_FIELD_CATEGORIES,
  type ConsentRecord,
  type ConsentAuditEntry,
  type DataShareRequest,
  type DataShareResponse,
} from "./consent";

export {
  NotificationManager,
  NOTIFICATION_TEMPLATES,
  type NotificationEvent,
  type NotificationPayload,
  type NotificationSubscription,
} from "./notifications";

export {
  DataQualityChecker,
  VALIDATION_PATTERNS,
  validateRequired,
  validateFormat,
  validateLength,
  validateRange,
  validateIndianAddress,
  type ValidationRule,
  type ValidationResult,
  type DataQualityReport,
} from "./data-quality";

export {
  WorkflowEngine,
  WORKFLOW_TEMPLATES,
  parseIntent,
  type Workflow,
  type WorkflowStep,
  type WorkflowTemplate,
  type ParsedIntent,
} from "./workflow-engine";

// ─── Interoperability Manager (Main Entry Point) ───────────────

import { ConnectorRegistry, MockConnector, DEFAULT_CONNECTOR_CONFIGS } from "./connector";
import { ConsentManager } from "./consent";
import { NotificationManager } from "./notifications";
import { DataQualityChecker } from "./data-quality";
import { WorkflowEngine } from "./workflow-engine";

export class InteroperabilityManager {
  public connectors: ConnectorRegistry;
  public consent: ConsentManager;
  public notifications: NotificationManager;
  public dataQuality: DataQualityChecker;
  public workflow: WorkflowEngine;

  constructor() {
    this.connectors = new ConnectorRegistry();
    this.consent = new ConsentManager();
    this.notifications = new NotificationManager();
    this.dataQuality = new DataQualityChecker();
    this.workflow = new WorkflowEngine();

    this.initializeConnectors();
  }

  private initializeConnectors() {
    DEFAULT_CONNECTOR_CONFIGS.forEach((config) => {
      const connector = new MockConnector(config, 150 + Math.random() * 100);
      this.connectors.register(connector);
    });
  }

  // Get system health overview
  getSystemHealth(): {
    connectors: ReturnType<ConnectorRegistry["getHealthStatus"]>;
    workflows: ReturnType<WorkflowEngine["getStats"]>;
    timestamp: string;
  } {
    return {
      connectors: this.connectors.getHealthStatus(),
      workflows: this.workflow.getStats(),
      timestamp: new Date().toISOString(),
    };
  }
}

// Singleton instance
let managerInstance: InteroperabilityManager | null = null;

export function getInteroperabilityManager(): InteroperabilityManager {
  if (!managerInstance) {
    managerInstance = new InteroperabilityManager();
  }
  return managerInstance;
}
