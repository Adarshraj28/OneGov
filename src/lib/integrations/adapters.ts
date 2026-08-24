import { v4 as uuidv4 } from "uuid";

// ─── Base Adapter Interface ───────────────────────────────────

export interface GovernmentServiceAdapter {
  name: string;
  endpoint: string;
  transformPayload(payload: Record<string, unknown>): Record<string, unknown>;
  submitApplication(
    payload: Record<string, unknown>
  ): Promise<Record<string, unknown>>;
  getApplicationStatus(
    applicationId: string
  ): Promise<Record<string, unknown>>;
  normalizeStatus(rawResponse: Record<string, unknown>): {
    status: string;
    message: string;
  };
}

// ─── Status Mapping ───────────────────────────────────────────

const STATUS_MAP: Record<string, string> = {
  SUBMITTED: "submitted",
  PENDING_REVIEW: "in_progress",
  UNDER_REVIEW: "in_progress",
  UNDER_PROCESS: "in_progress",
  INITIATED: "submitted",
  APPROVED: "approved",
  SUCCESS: "approved",
  COMPLETED: "approved",
  REJECTED: "rejected",
  FAILED: "failed",
};

function normalize(rawStatus: string): { status: string; message: string } {
  const status = STATUS_MAP[rawStatus] || "in_progress";
  return {
    status,
    message: `Application status: ${rawStatus} → ${status}`,
  };
}

// ─── Business Registration Adapter ────────────────────────────

class BusinessRegistrationAdapter implements GovernmentServiceAdapter {
  name = "Business Registration Service";
  endpoint = "/api/integrations/business";

  transformPayload(payload: Record<string, unknown>) {
    return {
      applicant_name: payload.name,
      applicant_email: payload.email,
      applicant_phone: payload.phone,
      business_name: payload.businessName,
      business_type: payload.businessType || "sole_proprietorship",
      address: payload.address,
      city: payload.city,
      state: payload.state || "Maharashtra",
      pincode: payload.pincode,
      pan_number: payload.panNumber,
    };
  }

  async submitApplication(payload: Record<string, unknown>) {
    const applicationId = `BR-${2026}-${Math.floor(10000 + Math.random() * 90000)}`;
    // Simulate processing
    const statuses = ["SUBMITTED", "PENDING_REVIEW"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      applicationId,
      status,
      message: "Application submitted successfully",
      department: "Ministry of Corporate Affairs",
      timestamp: new Date().toISOString(),
      estimatedCompletion: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      data: payload,
    };
  }

  async getApplicationStatus(applicationId: string) {
    const statuses = ["PENDING_REVIEW", "APPROVED"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      applicationId,
      status,
      lastUpdated: new Date().toISOString(),
    };
  }

  normalizeStatus(rawResponse: Record<string, unknown>) {
    return normalize(rawResponse.status as string);
  }
}

// ─── Municipal Permission Adapter ─────────────────────────────

class MunicipalAdapter implements GovernmentServiceAdapter {
  name = "Municipal Corporation Services";
  endpoint = "/api/integrations/municipal";

  transformPayload(payload: Record<string, unknown>) {
    return {
      applicant_name: payload.name,
      correspondence_address: payload.address,
      establishment_category: payload.businessType || "commercial",
      establishment_name: payload.businessName,
      city: payload.city,
      district: payload.city,
      state: payload.state || "Maharashtra",
      pincode: payload.pincode,
      property_type: "commercial",
      area_sqft: payload.area || "500",
    };
  }

  async submitApplication(payload: Record<string, unknown>) {
    const applicationId = `MC-${2026}-${Math.floor(10000 + Math.random() * 90000)}`;
    const statuses = ["SUBMITTED", "INITIATED"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      applicationId,
      status,
      message: "Municipal application received",
      department: "Municipal Corporation",
      timestamp: new Date().toISOString(),
      estimatedCompletion: new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  }

  async getApplicationStatus(applicationId: string) {
    const statuses = ["INITIATED", "UNDER_PROCESS", "APPROVED"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      applicationId,
      status,
      lastUpdated: new Date().toISOString(),
    };
  }

  normalizeStatus(rawResponse: Record<string, unknown>) {
    return normalize(rawResponse.status as string);
  }
}

// ─── Food License Adapter ─────────────────────────────────────

class FoodLicenseAdapter implements GovernmentServiceAdapter {
  name = "Food Safety & Standards Authority";
  endpoint = "/api/integrations/food-license";

  transformPayload(payload: Record<string, unknown>) {
    return {
      applicant_name: payload.name,
      business_name: payload.businessName,
      business_address: payload.address,
      city: payload.city,
      state: payload.state || "Maharashtra",
      food_category: payload.foodCategory || "restaurant",
      fssai_type: payload.licenseType || "state",
      pan_number: payload.panNumber,
      ownership_type: payload.businessType || "sole_proprietorship",
    };
  }

  async submitApplication(payload: Record<string, unknown>) {
    const applicationId = `FL-${2026}-${Math.floor(10000 + Math.random() * 90000)}`;
    return {
      applicationId,
      status: "SUBMITTED",
      message: "Food license application received",
      department: "FSSAI",
      timestamp: new Date().toISOString(),
      estimatedCompletion: new Date(
        Date.now() + 21 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  }

  async getApplicationStatus(applicationId: string) {
    const statuses = ["SUBMITTED", "UNDER_REVIEW", "APPROVED"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      applicationId,
      status,
      lastUpdated: new Date().toISOString(),
    };
  }

  normalizeStatus(rawResponse: Record<string, unknown>) {
    return normalize(rawResponse.status as string);
  }
}

// ─── Fire Safety Adapter ──────────────────────────────────────

class FireSafetyAdapter implements GovernmentServiceAdapter {
  name = "Fire Safety Department";
  endpoint = "/api/integrations/fire-safety";

  transformPayload(payload: Record<string, unknown>) {
    return {
      applicant_name: payload.name,
      premises_address: payload.address,
      city: payload.city,
      state: payload.state || "Maharashtra",
      building_type: "commercial",
      occupancy_type: payload.businessType || "restaurant",
      built_up_area: payload.area || "500",
      number_of_floors: payload.floors || "1",
      fire_safety_measures: payload.fireMeasures || ["extinguisher", "sprinkler"],
    };
  }

  async submitApplication(payload: Record<string, unknown>) {
    const applicationId = `FS-${2026}-${Math.floor(10000 + Math.random() * 90000)}`;
    return {
      applicationId,
      status: "INITIATED",
      message: "Fire safety inspection request received",
      department: "Fire Department",
      timestamp: new Date().toISOString(),
      estimatedCompletion: new Date(
        Date.now() + 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  }

  async getApplicationStatus(applicationId: string) {
    const statuses = ["INITIATED", "UNDER_PROCESS", "SUCCESS"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      applicationId,
      status,
      lastUpdated: new Date().toISOString(),
    };
  }

  normalizeStatus(rawResponse: Record<string, unknown>) {
    return normalize(rawResponse.status as string);
  }
}

// ─── Tax Registration Adapter ─────────────────────────────────

class TaxAdapter implements GovernmentServiceAdapter {
  name = "Tax Registration Authority";
  endpoint = "/api/integrations/tax";

  transformPayload(payload: Record<string, unknown>) {
    return {
      applicant_name: payload.name,
      pan_number: payload.panNumber,
      business_name: payload.businessName,
      business_type: payload.businessType || "sole_proprietorship",
      address: payload.address,
      city: payload.city,
      state: payload.state || "Maharashtra",
      pincode: payload.pincode,
      registration_type: "GST",
      annual_turnover: payload.annualTurnover || "0",
    };
  }

  async submitApplication(payload: Record<string, unknown>) {
    const applicationId = `TX-${2026}-${Math.floor(10000 + Math.random() * 90000)}`;
    return {
      applicationId,
      status: "SUBMITTED",
      message: "Tax registration application received",
      department: "Income Tax Department",
      timestamp: new Date().toISOString(),
      estimatedCompletion: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  }

  async getApplicationStatus(applicationId: string) {
    const statuses = ["SUBMITTED", "PENDING_REVIEW", "APPROVED"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      applicationId,
      status,
      lastUpdated: new Date().toISOString(),
    };
  }

  normalizeStatus(rawResponse: Record<string, unknown>) {
    return normalize(rawResponse.status as string);
  }
}

// ─── Export Instances ─────────────────────────────────────────

export const businessRegistrationAdapter = new BusinessRegistrationAdapter();
export const municipalAdapter = new MunicipalAdapter();
export const foodLicenseAdapter = new FoodLicenseAdapter();
export const fireSafetyAdapter = new FireSafetyAdapter();
export const taxAdapter = new TaxAdapter();
