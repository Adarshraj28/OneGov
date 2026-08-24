import { prisma } from "../db";
import { v4 as uuidv4 } from "uuid";
import {
  businessRegistrationAdapter,
  municipalAdapter,
  foodLicenseAdapter,
  fireSafetyAdapter,
  taxAdapter,
} from "./adapters";
import type { GovernmentServiceAdapter } from "./adapters";

// ─── Adapter Registry ─────────────────────────────────────────

const adapterMap: Record<string, GovernmentServiceAdapter> = {
  business_registration: businessRegistrationAdapter,
  municipal_permission: municipalAdapter,
  food_license: foodLicenseAdapter,
  fire_safety: fireSafetyAdapter,
  tax_registration: taxAdapter,
};

// ─── Integration Health State (in-memory for simulation) ──────

export const serviceHealth: Record<string, { status: string; latency: number }> = {
  business_registration: { status: "online", latency: 120 },
  municipal_permission: { status: "online", latency: 200 },
  food_license: { status: "online", latency: 150 },
  fire_safety: { status: "online", latency: 180 },
  tax_registration: { status: "online", latency: 100 },
};

export function setServiceStatus(department: string, status: string) {
  if (serviceHealth[department]) {
    serviceHealth[department].status = status;
  }
}

export function getServiceHealth() {
  return Object.entries(serviceHealth).map(([dept, info]) => ({
    department: dept,
    ...info,
  }));
}

// ─── Gateway Core ─────────────────────────────────────────────

export interface GatewayRequest {
  journeyStepId: string;
  serviceCode: string;
  department: string;
  payload: Record<string, unknown>;
}

export interface GatewayResponse {
  success: boolean;
  applicationId?: string;
  status: string;
  rawResponse: Record<string, unknown>;
  correlationId: string;
  latencyMs: number;
  error?: string;
}

export async function submitToExternalService(
  request: GatewayRequest
): Promise<GatewayResponse> {
  const correlationId = uuidv4();
  const startTime = Date.now();

  const adapter = adapterMap[request.serviceCode];
  if (!adapter) {
    return {
      success: false,
      status: "failed",
      rawResponse: {},
      correlationId,
      latencyMs: 0,
      error: `No adapter found for service: ${request.serviceCode}`,
    };
  }

  // Check health
  const health = serviceHealth[request.serviceCode];
  if (!health || health.status === "offline") {
    const logEntry = await logIntegrationRequest({
      journeyStepId: request.journeyStepId,
      department: request.department,
      endpoint: adapter.endpoint,
      method: "POST",
      requestPayload: request.payload,
      responsePayload: { error: "Service offline" },
      statusCode: 503,
      status: "failed",
      correlationId,
      latencyMs: 0,
      errorMessage: "Service is currently offline",
    });

    return {
      success: false,
      status: "failed",
      rawResponse: { error: "Service offline" },
      correlationId,
      latencyMs: 0,
      error: "Service is currently offline. Request saved for retry.",
    };
  }

  try {
    // Transform payload through adapter
    const transformedPayload = adapter.transformPayload(request.payload);

    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, health.latency));

    // Submit to mock service
    const response = await adapter.submitApplication(transformedPayload);

    // Normalize response
    const normalized = adapter.normalizeStatus(response);

    const latencyMs = Date.now() - startTime;

    // Log the request
    await logIntegrationRequest({
      journeyStepId: request.journeyStepId,
      department: request.department,
      endpoint: adapter.endpoint,
      method: "POST",
      requestPayload: transformedPayload,
      responsePayload: response,
      statusCode: 200,
      status: "success",
      correlationId,
      latencyMs,
    });

    // Update health stats
    health.latency = Math.round((health.latency + latencyMs) / 2);

    return {
      success: true,
      applicationId: response.applicationId as string,
      status: normalized.status,
      rawResponse: response,
      correlationId,
      latencyMs,
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    await logIntegrationRequest({
      journeyStepId: request.journeyStepId,
      department: request.department,
      endpoint: adapter.endpoint,
      method: "POST",
      requestPayload: request.payload,
      responsePayload: {},
      statusCode: 500,
      status: "failed",
      correlationId,
      latencyMs,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      success: false,
      status: "failed",
      rawResponse: {},
      correlationId,
      latencyMs,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function checkExternalStatus(
  serviceCode: string,
  applicationId: string
): Promise<GatewayResponse> {
  const correlationId = uuidv4();
  const startTime = Date.now();

  const adapter = adapterMap[serviceCode];
  if (!adapter) {
    return {
      success: false,
      status: "failed",
      rawResponse: {},
      correlationId,
      latencyMs: 0,
      error: `No adapter found for service: ${serviceCode}`,
    };
  }

  const health = serviceHealth[serviceCode];
  if (!health || health.status === "offline") {
    return {
      success: false,
      status: "failed",
      rawResponse: {},
      correlationId,
      latencyMs: 0,
      error: "Service offline",
    };
  }

  try {
    const response = await adapter.getApplicationStatus(applicationId);
    const normalized = adapter.normalizeStatus(response);
    const latencyMs = Date.now() - startTime;

    return {
      success: true,
      status: normalized.status,
      rawResponse: response,
      correlationId,
      latencyMs,
    };
  } catch (error) {
    return {
      success: false,
      status: "failed",
      rawResponse: {},
      correlationId,
      latencyMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function logIntegrationRequest(data: {
  journeyStepId: string;
  department: string;
  endpoint: string;
  method: string;
  requestPayload: Record<string, unknown>;
  responsePayload: Record<string, unknown>;
  statusCode: number;
  status: string;
  correlationId: string;
  latencyMs: number;
  errorMessage?: string;
}) {
  return prisma.integrationRequest.create({
    data: {
      ...data,
      requestPayload: JSON.stringify(data.requestPayload),
      responsePayload: JSON.stringify(data.responsePayload),
    },
  });
}

// ─── Retry with Exponential Backoff ───────────────────────────

export async function retryWithBackoff(
  fn: () => Promise<GatewayResponse>,
  maxRetries: number = 3
): Promise<GatewayResponse> {
  let lastError: GatewayResponse | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const result = await fn();
    if (result.success) return result;

    lastError = result;

    if (attempt < maxRetries - 1) {
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return lastError!;
}
