// ─── Data Quality Validation Layer ─────────────────────────────
// Validates data before exchange between government systems

export interface ValidationRule {
  field: string;
  rule: "required" | "format" | "range" | "length" | "reference" | "custom";
  params?: Record<string, unknown>;
  message: string;
}

export interface ValidationResult {
  field: string;
  rule: string;
  valid: boolean;
  value: unknown;
  message: string;
}

export interface DataQualityReport {
  valid: boolean;
  totalFields: number;
  validFields: number;
  invalidFields: number;
  results: ValidationResult[];
  timestamp: string;
}

// ─── Common Validation Patterns ────────────────────────────────

export const VALIDATION_PATTERNS = {
  aadhaar: /^[2-9]\d{11}$/, // 12 digits, first digit not 0 or 1
  pan: /^[A-Z]{5}\d{4}[A-Z]$/, // 5 letters + 4 digits + 1 letter
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/, // Indian mobile number
  pincode: /^[1-9]\d{5}$/, // 6 digit pincode
  gst: /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/,
  din: /^\d{8}$/, // 8 digit DIN
  voterId: /^[A-Z]{3}\d{7}$/, // 3 letters + 7 digits
  passport: /^[A-Z]\d{7}$/, // 1 letter + 7 digits
  vehicleClass: /^(LMV|HMV|MCWG|MCWOG|TRANS|TRAC)$/,
};

// ─── Field Validators ──────────────────────────────────────────

export function validateRequired(
  field: string,
  value: unknown
): ValidationResult {
  const valid =
    value !== null && value !== undefined && value !== "" && value !== 0;
  return {
    field,
    rule: "required",
    valid,
    value,
    message: valid ? "" : `${field} is required`,
  };
}

export function validateFormat(
  field: string,
  value: unknown,
  pattern: RegExp,
  formatName: string
): ValidationResult {
  if (value === null || value === undefined || value === "") {
    return {
      field,
      rule: "format",
      valid: false,
      value,
      message: `${field} is required`,
    };
  }

  const strValue = String(value);
  const valid = pattern.test(strValue);
  return {
    field,
    rule: "format",
    valid,
    value,
    message: valid
      ? ""
      : `${field} must be in valid ${formatName} format`,
  };
}

export function validateLength(
  field: string,
  value: unknown,
  min: number,
  max: number
): ValidationResult {
  if (value === null || value === undefined) {
    return {
      field,
      rule: "length",
      valid: false,
      value,
      message: `${field} is required`,
    };
  }

  const strValue = String(value);
  const len = strValue.length;
  const valid = len >= min && len <= max;
  return {
    field,
    rule: "length",
    valid,
    value,
    message: valid
      ? ""
      : `${field} must be between ${min} and ${max} characters`,
  };
}

export function validateRange(
  field: string,
  value: unknown,
  min: number,
  max: number
): ValidationResult {
  if (value === null || value === undefined) {
    return {
      field,
      rule: "range",
      valid: false,
      value,
      message: `${field} is required`,
    };
  }

  const numValue = Number(value);
  const valid = !isNaN(numValue) && numValue >= min && numValue <= max;
  return {
    field,
    rule: "range",
    valid,
    value,
    message: valid
      ? ""
      : `${field} must be between ${min} and ${max}`,
  };
}

export function validateIndianAddress(
  field: string,
  value: unknown
): ValidationResult {
  if (value === null || value === undefined || value === "") {
    return {
      field,
      rule: "custom",
      valid: false,
      value,
      message: `${field} is required`,
    };
  }

  const strValue = String(value).toLowerCase();
  const indianStates = [
    "maharashtra",
    "karnataka",
    "tamil nadu",
    "delhi",
    "gujarat",
    "rajasthan",
    "uttar pradesh",
    "madhya pradesh",
    "west bengal",
    "andhra pradesh",
    "telangana",
    "kerala",
    "punjab",
    "haryana",
    "bihar",
    "odisha",
    "jharkhand",
    "chhattisgarh",
    "assam",
    "goa",
    "himachal pradesh",
    "uttarakhand",
    "jammu and kashmir",
    "ladakh",
    "meghalaya",
    "manipur",
    "mizoram",
    "nagaland",
    "tripura",
    "arunachal pradesh",
    "sikkim",
  ];

  const valid = indianStates.some((state) => strValue.includes(state));
  return {
    field,
    rule: "custom",
    valid: true, // Don't block on address validation
    value,
    message: valid ? "" : `Please verify the state in ${field}`,
  };
}

// ─── Data Quality Checker ──────────────────────────────────────

export class DataQualityChecker {
  private rules: Map<string, ValidationRule[]> = new Map();

  constructor() {
    this.initializeDefaultRules();
  }

  private initializeDefaultRules() {
    // Aadhaar validation rules
    this.rules.set("aadhaar", [
      { field: "aadhaarNumber", rule: "required", message: "Aadhaar number is required" },
      {
        field: "aadhaarNumber",
        rule: "format",
        params: { pattern: VALIDATION_PATTERNS.aadhaar },
        message: "Invalid Aadhaar number format",
      },
      { field: "name", rule: "required", message: "Name is required" },
      { field: "dateOfBirth", rule: "required", message: "Date of birth is required" },
      { field: "address", rule: "required", message: "Address is required" },
      { field: "mobile", rule: "required", message: "Mobile number is required" },
      {
        field: "mobile",
        rule: "format",
        params: { pattern: VALIDATION_PATTERNS.phone },
        message: "Invalid mobile number",
      },
    ]);

    // PAN validation rules
    this.rules.set("pan", [
      { field: "name", rule: "required", message: "Name is required" },
      { field: "fatherName", rule: "required", message: "Father's name is required" },
      { field: "dateOfBirth", rule: "required", message: "Date of birth is required" },
      {
        field: "panNumber",
        rule: "format",
        params: { pattern: VALIDATION_PATTERNS.pan },
        message: "Invalid PAN format (e.g., ABCDE1234F)",
      },
      { field: "address", rule: "required", message: "Address is required" },
    ]);

    // Passport validation rules
    this.rules.set("passport", [
      { field: "name", rule: "required", message: "Name is required" },
      { field: "fatherName", rule: "required", message: "Father's name is required" },
      { field: "motherName", rule: "required", message: "Mother's name is required" },
      { field: "dateOfBirth", rule: "required", message: "Date of birth is required" },
      { field: "address", rule: "required", message: "Address is required" },
      { field: "mobile", rule: "required", message: "Mobile number is required" },
      { field: "email", rule: "required", message: "Email is required" },
      {
        field: "email",
        rule: "format",
        params: { pattern: VALIDATION_PATTERNS.email },
        message: "Invalid email format",
      },
    ]);

    // Business registration rules
    this.rules.set("business", [
      { field: "name", rule: "required", message: "Applicant name is required" },
      { field: "email", rule: "required", message: "Email is required" },
      {
        field: "email",
        rule: "format",
        params: { pattern: VALIDATION_PATTERNS.email },
        message: "Invalid email format",
      },
      { field: "phone", rule: "required", message: "Phone number is required" },
      {
        field: "phone",
        rule: "format",
        params: { pattern: VALIDATION_PATTERNS.phone },
        message: "Invalid phone number",
      },
      { field: "businessName", rule: "required", message: "Business name is required" },
      { field: "businessType", rule: "required", message: "Business type is required" },
      { field: "address", rule: "required", message: "Address is required" },
      { field: "city", rule: "required", message: "City is required" },
      { field: "state", rule: "required", message: "State is required" },
      { field: "pincode", rule: "required", message: "Pincode is required" },
      {
        field: "pincode",
        rule: "format",
        params: { pattern: VALIDATION_PATTERNS.pincode },
        message: "Invalid pincode",
      },
    ]);

    // Driving license rules
    this.rules.set("driving_license", [
      { field: "name", rule: "required", message: "Name is required" },
      { field: "dateOfBirth", rule: "required", message: "Date of birth is required" },
      { field: "address", rule: "required", message: "Address is required" },
      { field: "vehicleClass", rule: "required", message: "Vehicle class is required" },
      { field: "mobile", rule: "required", message: "Mobile number is required" },
    ]);
  }

  // Validate data against rules
  validate(
    serviceType: string,
    data: Record<string, unknown>
  ): DataQualityReport {
    const rules = this.rules.get(serviceType) || [];
    const results: ValidationResult[] = [];

    rules.forEach((rule) => {
      const value = data[rule.field];
      let result: ValidationResult;

      switch (rule.rule) {
        case "required":
          result = validateRequired(rule.field, value);
          break;
        case "format":
          result = validateFormat(
            rule.field,
            value,
            rule.params?.pattern as RegExp || /./,
            rule.message
          );
          break;
        case "length":
          result = validateLength(
            rule.field,
            value,
            (rule.params?.min as number) || 0,
            (rule.params?.max as number) || 100
          );
          break;
        case "range":
          result = validateRange(
            rule.field,
            value,
            (rule.params?.min as number) || 0,
            (rule.params?.max as number) || 100
          );
          break;
        default:
          result = {
            field: rule.field,
            rule: rule.rule,
            valid: true,
            value,
            message: "",
          };
      }

      if (!result.valid && rule.message) {
        result.message = rule.message;
      }

      results.push(result);
    });

    const validFields = results.filter((r) => r.valid).length;
    const invalidFields = results.filter((r) => !r.valid).length;

    return {
      valid: invalidFields === 0,
      totalFields: results.length,
      validFields,
      invalidFields,
      results,
      timestamp: new Date().toISOString(),
    };
  }

  // Add custom validation rules
  addRules(serviceType: string, rules: ValidationRule[]): void {
    const existing = this.rules.get(serviceType) || [];
    this.rules.set(serviceType, [...existing, ...rules]);
  }
}
