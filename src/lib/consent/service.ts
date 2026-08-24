import { prisma } from "../db";
import { logAuditEvent, AuditActions } from "../audit/service";

export interface DataShareRequest {
  userId: string;
  journeyId?: string;
  department: string;
  fieldsRequested: string[];
  purpose: string;
}

export interface DataShareDecision {
  consentId: string;
  granted: boolean;
  fieldsShared: string[];
}

// What data each department actually needs
const DEPARTMENT_DATA_REQUIREMENTS: Record<string, string[]> = {
  "Business Registration": ["name", "email", "phone", "address", "city", "state", "pincode", "panNumber", "businessName", "businessType"],
  "Municipal Corporation": ["name", "address", "city", "state", "pincode", "businessName", "businessType"],
  "Food Safety (FSSAI)": ["name", "panNumber", "businessName", "address", "city", "state", "businessType"],
  "Fire Department": ["name", "address", "city", "state", "businessName"],
  "Tax Registration": ["name", "panNumber", "address", "city", "state", "pincode", "businessName", "businessType"],
};

const SENSITIVE_FIELDS = ["panNumber", "aadhaarNumber", "gstNumber"];

export function getDepartmentDataRequirements(department: string) {
  const required = DEPARTMENT_DATA_REQUIREMENTS[department] || [];
  const sensitive = required.filter((f) => SENSITIVE_FIELDS.includes(f));
  const nonSensitive = required.filter((f) => !SENSITIVE_FIELDS.includes(f));

  return {
    department,
    requiredFields: required,
    sensitiveFields: sensitive,
    nonSensitiveFields: nonSensitive,
    excludedFields: ["aadhaarNumber", "gstNumber"].filter(
      (f) => !required.includes(f)
    ),
  };
}

export async function createConsentRequest(
  request: DataShareRequest
) {
  const requirements = getDepartmentDataRequirements(request.department);

  const consent = await prisma.consentRecord.create({
    data: {
      userId: request.userId,
      journeyId: request.journeyId,
      department: request.department,
      fieldsShared: JSON.stringify(requirements.requiredFields),
      purpose: request.purpose,
      granted: false,
    },
  });

  await logAuditEvent(
    request.userId,
    "consent.requested",
    "consent",
    consent.id,
    {
      department: request.department,
      fields: requirements.requiredFields,
      purpose: request.purpose,
    }
  );

  return {
    consentId: consent.id,
    department: request.department,
    requirements,
    purpose: request.purpose,
  };
}

export async function grantConsent(
  consentId: string,
  userId: string
) {
  const consent = await prisma.consentRecord.update({
    where: { id: consentId },
    data: {
      granted: true,
      grantedAt: new Date(),
    },
  });

  await logAuditEvent(
    userId,
    AuditActions.CONSENT_GRANTED,
    "consent",
    consentId,
    {
      department: consent.department,
      fields: consent.fieldsShared,
    }
  );

  return consent;
}

export async function revokeConsent(consentId: string, userId: string) {
  const consent = await prisma.consentRecord.update({
    where: { id: consentId },
    data: {
      granted: false,
      revokedAt: new Date(),
    },
  });

  await logAuditEvent(
    userId,
    AuditActions.CONSENT_REVOKED,
    "consent",
    consentId,
    { department: consent.department }
  );

  return consent;
}

export async function getConsentHistory(userId: string) {
  return prisma.consentRecord.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
