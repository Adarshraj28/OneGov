// ─── Consent-Based Data Sharing System ─────────────────────────
// Implements privacy-preserving data sharing between government departments

export interface ConsentRecord {
  id: string;
  userId: string;
  journeyId?: string;
  requesterDepartment: string;
  dataOwnerDepartment: string;
  fieldsRequested: string[];
  fieldsApproved: string[];
  purpose: string;
  status: "pending" | "approved" | "revoked" | "expired";
  grantedAt?: string;
  revokedAt?: string;
  expiresAt: string;
  auditTrail: ConsentAuditEntry[];
}

export interface ConsentAuditEntry {
  action: "created" | "approved" | "revoked" | "accessed" | "expired";
  performedBy: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface DataShareRequest {
  userId: string;
  journeyId?: string;
  sourceDepartment: string;
  targetDepartment: string;
  fields: string[];
  purpose: string;
  duration: number; // in hours
}

export interface DataShareResponse {
  success: boolean;
  consentId?: string;
  sharedData?: Record<string, unknown>;
  error?: string;
}

// ─── Department Data Requirements ──────────────────────────────

export const DEPARTMENT_DATA_REQUIREMENTS: Record<
  string,
  {
    requiredFields: string[];
    sensitiveFields: string[];
    description: string;
  }
> = {
  uidai: {
    requiredFields: [
      "name",
      "dateOfBirth",
      "gender",
      "address",
      "mobile",
      "photo",
    ],
    sensitiveFields: ["aadhaarNumber", "biometrics"],
    description: "Unique Identification Authority of India",
  },
  incometax: {
    requiredFields: ["name", "fatherName", "dateOfBirth", "address", "panNumber"],
    sensitiveFields: ["panNumber", "incomeDetails", "taxReturns"],
    description: "Income Tax Department",
  },
  passport: {
    requiredFields: [
      "name",
      "fatherName",
      "motherName",
      "dateOfBirth",
      "address",
      "photo",
      "birthCertificate",
    ],
    sensitiveFields: ["aadhaar", "panNumber", "policeVerification"],
    description: "Passport Seva, Ministry of External Affairs",
  },
  morth: {
    requiredFields: ["name", "dateOfBirth", "address", "photo", "medicalCert"],
    sensitiveFields: ["drivingLicenseNumber", "vehicleClass"],
    description: "Ministry of Road Transport & Highways",
  },
  eci: {
    requiredFields: ["name", "fatherName", "dateOfBirth", "gender", "address"],
    sensitiveFields: ["voterIdNumber", "electionDistrict"],
    description: "Election Commission of India",
  },
  mca: {
    requiredFields: [
      "name",
      "email",
      "phone",
      "address",
      "businessName",
      "businessType",
    ],
    sensitiveFields: ["panNumber", "din", "cin"],
    description: "Ministry of Corporate Affairs",
  },
  fssai: {
    requiredFields: [
      "name",
      "businessName",
      "address",
      "foodCategory",
      "businessType",
    ],
    sensitiveFields: ["fssaiLicenseNumber", "inspectionReports"],
    description: "Food Safety and Standards Authority of India",
  },
  municipal: {
    requiredFields: ["name", "address", "city", "state", "businessName"],
    sensitiveFields: ["propertyId", "taxAssessment"],
    description: "Municipal Corporation",
  },
};

// ─── Sensitive Fields Classification ───────────────────────────

export const SENSITIVE_FIELD_CATEGORIES = {
  identity: ["aadhaarNumber", "panNumber", "voterIdNumber", "passportNumber"],
  financial: ["incomeDetails", "taxReturns", "bankAccount"],
  biometric: ["biometrics", "fingerprints", "irisScan"],
  contact: ["mobile", "email", "alternatePhone"],
  location: ["address", "propertyId", "gpsCoordinates"],
};

// ─── Consent Manager ───────────────────────────────────────────

export class ConsentManager {
  private consents: Map<string, ConsentRecord> = new Map();
  private accessLog: Array<{
    consentId: string;
    accessedBy: string;
    fields: string[];
    timestamp: string;
  }> = [];

  constructor() {
    this.initializeDefaultConsents();
  }

  private initializeDefaultConsents() {
    // Pre-existing consents for demo
    const defaultConsents: ConsentRecord[] = [
      {
        id: "consent-001",
        userId: "citizen-001",
        journeyId: "journey-001",
        requesterDepartment: "mca",
        dataOwnerDepartment: "uidai",
        fieldsRequested: ["name", "address", "dateOfBirth"],
        fieldsApproved: ["name", "address", "dateOfBirth"],
        purpose: "Business Registration - Identity Verification",
        status: "approved",
        grantedAt: "2026-08-10T10:00:00Z",
        expiresAt: "2026-09-10T10:00:00Z",
        auditTrail: [
          {
            action: "created",
            performedBy: "system",
            timestamp: "2026-08-10T09:55:00Z",
          },
          {
            action: "approved",
            performedBy: "citizen-001",
            timestamp: "2026-08-10T10:00:00Z",
          },
        ],
      },
      {
        id: "consent-002",
        userId: "citizen-001",
        journeyId: "journey-001",
        requesterDepartment: "incometax",
        dataOwnerDepartment: "uidai",
        fieldsRequested: ["name", "dateOfBirth", "aadhaarNumber"],
        fieldsApproved: ["name", "dateOfBirth"],
        purpose: "Tax Registration - PAN Application",
        status: "approved",
        grantedAt: "2026-08-10T10:05:00Z",
        expiresAt: "2026-09-10T10:05:00Z",
        auditTrail: [
          {
            action: "created",
            performedBy: "system",
            timestamp: "2026-08-10T10:00:00Z",
          },
          {
            action: "approved",
            performedBy: "citizen-001",
            timestamp: "2026-08-10T10:05:00Z",
          },
        ],
      },
    ];

    defaultConsents.forEach((consent) => {
      this.consents.set(consent.id, consent);
    });
  }

  // Request data sharing consent
  requestConsent(request: DataShareRequest): ConsentRecord {
    const id = `consent-${Date.now()}`;
    const requirements =
      DEPARTMENT_DATA_REQUIREMENTS[request.targetDepartment];

    const consent: ConsentRecord = {
      id,
      userId: request.userId,
      journeyId: request.journeyId,
      requesterDepartment: request.sourceDepartment,
      dataOwnerDepartment: request.targetDepartment,
      fieldsRequested: request.fields,
      fieldsApproved: [], // Initially no fields approved
      purpose: request.purpose,
      status: "pending",
      expiresAt: new Date(
        Date.now() + request.duration * 60 * 60 * 1000
      ).toISOString(),
      auditTrail: [
        {
          action: "created",
          performedBy: request.sourceDepartment,
          timestamp: new Date().toISOString(),
          metadata: {
            requiredFields: requirements?.requiredFields,
            sensitiveFields: requirements?.sensitiveFields,
          },
        },
      ],
    };

    this.consents.set(id, consent);
    return consent;
  }

  // Approve consent (citizen action)
  approveConsent(
    consentId: string,
    userId: string,
    approvedFields: string[]
  ): ConsentRecord | null {
    const consent = this.consents.get(consentId);
    if (!consent || consent.userId !== userId) return null;

    consent.status = "approved";
    consent.fieldsApproved = approvedFields;
    consent.grantedAt = new Date().toISOString();
    consent.auditTrail.push({
      action: "approved",
      performedBy: userId,
      timestamp: new Date().toISOString(),
      metadata: { approvedFields },
    });

    return consent;
  }

  // Revoke consent (citizen action)
  revokeConsent(consentId: string, userId: string): ConsentRecord | null {
    const consent = this.consents.get(consentId);
    if (!consent || consent.userId !== userId) return null;

    consent.status = "revoked";
    consent.revokedAt = new Date().toISOString();
    consent.fieldsApproved = [];
    consent.auditTrail.push({
      action: "revoked",
      performedBy: userId,
      timestamp: new Date().toISOString(),
    });

    return consent;
  }

  // Access data with consent check
  accessData(
    consentId: string,
    accessedBy: string,
    requestedFields: string[]
  ): DataShareResponse {
    const consent = this.consents.get(consentId);

    if (!consent) {
      return { success: false, error: "Consent not found" };
    }

    if (consent.status !== "approved") {
      return { success: false, error: "Consent not approved" };
    }

    if (new Date(consent.expiresAt) < new Date()) {
      consent.status = "expired";
      return { success: false, error: "Consent expired" };
    }

    // Filter only approved fields
    const sharedFields = requestedFields.filter((f) =>
      consent.fieldsApproved.includes(f)
    );

    if (sharedFields.length === 0) {
      return { success: false, error: "No fields approved for sharing" };
    }

    // Log access
    this.accessLog.push({
      consentId,
      accessedBy,
      fields: sharedFields,
      timestamp: new Date().toISOString(),
    });

    consent.auditTrail.push({
      action: "accessed",
      performedBy: accessedBy,
      timestamp: new Date().toISOString(),
      metadata: { accessedFields: sharedFields },
    });

    // Return mock data (in production, this would fetch from the source department)
    const mockData: Record<string, unknown> = {};
    sharedFields.forEach((field) => {
      mockData[field] = `[REDACTED_${field.toUpperCase()}]`;
    });

    return {
      success: true,
      consentId,
      sharedData: mockData,
    };
  }

  // Get user's consents
  getUserConsents(userId: string): ConsentRecord[] {
    return Array.from(this.consents.values()).filter(
      (c) => c.userId === userId
    );
  }

  // Get consent by ID
  getConsent(consentId: string): ConsentRecord | undefined {
    return this.consents.get(consentId);
  }

  // Get access log
  getAccessLog(
    userId?: string
  ): typeof this.accessLog {
    if (userId) {
      return this.accessLog.filter((log) => {
        const consent = this.consents.get(log.consentId);
        return consent?.userId === userId;
      });
    }
    return this.accessLog;
  }

  // Check if consent exists and is valid
  hasValidConsent(
    userId: string,
    sourceDept: string,
    targetDept: string,
    fields: string[]
  ): boolean {
    return Array.from(this.consents.values()).some(
      (c) =>
        c.userId === userId &&
        c.requesterDepartment === sourceDept &&
        c.dataOwnerDepartment === targetDept &&
        c.status === "approved" &&
        new Date(c.expiresAt) > new Date() &&
        fields.every((f) => c.fieldsApproved.includes(f))
    );
  }
}
