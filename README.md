# ONEGOV — Government Services, Connected Around You

**One Request. Multiple Services. One Unified Journey.**

> A unified orchestration and interoperability platform that allows one citizen request to trigger, coordinate, track, and manage workflows across multiple independent government digital services.

## 📋 Problem Statement

**SIH26129 — System integration and interoperability among government digital platforms, resulting in fragmented service delivery.**

Organization: Government of Maharashtra | Category: Software | Theme: Smart Automation

---

## 🔍 Problem Analysis

Citizens face significant friction when interacting with government services:

- **Multiple Portals**: Different departments operate separate digital platforms
- **Repeated Data Entry**: Same information entered across 5+ portals
- **Fragmented Tracking**: No unified view of application status
- **Manual Coordination**: Citizens must understand which services depend on others
- **Disconnected Workflows**: No cross-department visibility or orchestration

**Average citizen journey**: 5.2 portals visited, 8 repeated data entries, 5 manual tracking points.

---

## 💡 Proposed Solution

ONEGOV provides an **intelligent orchestration layer** that connects fragmented government platforms without requiring them to be replaced.

### Core Innovation

```
Citizen Request
      ↓
AI Intent Understanding
      ↓
Service Discovery
      ↓
Dependency Analysis
      ↓
Unified Service Journey
      ↓
Data / Document Collection
      ↓
Integration Gateway
      ↓
Multiple Department Platforms
      ↓
Status Synchronization
      ↓
Unified Tracking
      ↓
Completion
```

A single request like *"I want to open a restaurant in Pune"* triggers an intelligent workflow spanning 6+ government services across 5 departments — automatically.

---

## 🏗️ Architecture

```
                         CITIZEN
                            │
                            ▼
                  ┌──────────────────┐
                  │   ONEGOV WEB APP │
                  │  (Next.js + UI)  │
                  └────────┬─────────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │  AI SERVICE      │
                 │  DISCOVERY       │
                 │  (Intent Parser) │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ WORKFLOW ENGINE  │
                 │ (Orchestration)  │
                 └────────┬─────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ INTEGRATION        │
                │ GATEWAY            │
                │ (Adapter Pattern)  │
                └─────────┬──────────┘
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
    BUSINESS API     MUNICIPAL API    LICENSE API
    (Mock External)  (Mock External)  (Mock External)
          │               │                │
          ▼               ▼                ▼
    Department DB    Department DB    Department DB
```

### Key Components

| Component | Purpose |
|-----------|---------|
| **AI Service Discovery** | Parses citizen intent and maps to available services |
| **Workflow Engine** | Manages service journeys with dependency resolution |
| **Integration Gateway** | Handles external API communication, retries, transforms |
| **Adapter Pattern** | Pluggable adapters for each government service |
| **Status Normalization** | Converts diverse external statuses to unified format |
| **Consent Manager** | Granular, least-privilege data sharing |
| **Audit Logger** | Complete accountability trail |

---

## 🤖 AI Components

### Intent Understanding
The AI service discovery module parses natural language requests and extracts:
- **Intent category** (restaurant setup, business registration, etc.)
- **Location** (city/state)
- **Required services** mapped from the service registry
- **Confidence score**

### Service Discovery
Maps detected intents to registered government services:
```json
{
  "intent": "restaurant_business_setup",
  "services": [
    { "service": "business_registration", "priority": 1 },
    { "service": "tax_registration", "priority": 2 },
    { "service": "food_license", "priority": 3 },
    { "service": "municipal_permission", "priority": 4 },
    { "service": "fire_safety", "priority": 5 },
    { "service": "final_approval", "priority": 6 }
  ]
}
```

### Document Intelligence
- Identifies document types from uploaded files
- Extracts relevant fields
- Prototype verification of extracted data
- Reuses across multiple service journeys

---

## 🔗 Integration Architecture

### Adapter Pattern
Each government service is connected through a standardized adapter:

```typescript
interface GovernmentServiceAdapter {
  transformPayload(payload: Record<string, unknown>): Record<string, unknown>;
  submitApplication(payload: Record<string, unknown>): Promise<Record<string, unknown>>;
  getApplicationStatus(applicationId: string): Promise<Record<string, unknown>>;
  normalizeStatus(rawResponse: Record<string, unknown>): { status: string; message: string };
}
```

### Data Transformation
ONEGOV normalizes data between its internal format and each department's format:

**ONEGOV Format:**
```json
{ "name": "Adarsh Raj", "address": "123 Main St", "businessType": "restaurant" }
```

**Municipal Format:**
```json
{ "applicant_name": "Adarsh Raj", "correspondence_address": "123 Main St", "establishment_category": "restaurant" }
```

### Status Normalization
Different platforms return different status names — ONEGOV normalizes them:

| External Status | ONEGOV Status |
|----------------|---------------|
| SUBMITTED, INITIATED | **submitted** |
| PENDING_REVIEW, UNDER_PROCESS | **in_progress** |
| APPROVED, SUCCESS, COMPLETED | **approved** |
| REJECTED | **rejected** |
| FAILED | **failed** |

---

## 🛡️ Security

### Authentication & Authorization
- **JWT-based** session authentication
- **Role-based access control** (Citizen, Officer, Admin)
- **Password hashing** with bcrypt (12 rounds)
- **HttpOnly cookies** for session management

### Consent-Based Data Sharing
Before any data is shared with a department, citizens see exactly what data will and won't be shared:

```
Municipal Department Needs:
  ✓ Name, Address, Business Type
  ✗ PAN Number, Aadhaar, Other Documents
```

### Audit Trail
Every significant action is logged with:
- User identity
- Action performed
- Resource affected
- Timestamp
- Metadata

---

## 🔄 Failure Handling

### Integration Resilience
```
Request → Integration Gateway
              ↓
          Timeout/Error
              ↓
       Retry Mechanism (exponential backoff)
              ↓
     Request Persisted
              ↓
     User Informed
              ↓
     Auto-recovery when service returns
```

### Retry Configuration
- **Max retries**: 3
- **Backoff**: Exponential (1s, 2s, 4s)
- **Dead letter**: Failed requests preserved for manual recovery
- **Graceful degradation**: Citizens see clear messaging about service status

### Status Simulation
Admins can toggle external service availability to demonstrate:
- Service offline handling
- Retry mechanism behavior
- Auto-recovery on service restoration
- Citizen notification of service unavailability

---

## 📊 Database Architecture

### Core Tables
- **User** — Authentication and roles
- **CitizenProfile** — Reusable citizen data
- **Department** — Government departments
- **Service** — Service registry
- **ServiceJourney** — Unified citizen journeys
- **JourneyStep** — Individual service steps
- **Document** — Uploaded documents
- **IntegrationRequest** — External API call logs
- **ConsentRecord** — Data sharing consent
- **Notification** — In-app notifications
- **AuditLog** — Complete audit trail
- **IntegrationHealth** — Service health monitoring

---

## 🚀 Scalability

### Future-Ready Design
Adding a new government department requires:
1. Register the service in the Service Registry
2. Create an adapter implementing `GovernmentServiceAdapter`
3. Configure dependency rules
4. Done — no other code changes needed

### Production Considerations
- Database: Swap SQLite → PostgreSQL
- Caching: Add Redis for session management and caching
- Queue: Add job queue for async integration processing
- Monitoring: Add OpenTelemetry for distributed tracing
- AI: Integrate LLM for improved intent understanding

---

## 🎯 Demo Instructions

### Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd onegov

# Install dependencies
npm install

# Set up database
cp .env.example .env
npx prisma db push

# Seed demo data
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Citizen | adarsh@citizen.gov | password123 |
| Citizen | priya@citizen.gov | password123 |
| Officer | rajesh@officer.gov | password123 |
| Admin | admin@onegov.gov | password123 |

### 5-Minute Demo Script

1. **The Problem** — Show 6 services across 5 departments
2. **Citizen Request** — Enter "I want to open a restaurant in Pune"
3. **AI Processing** — Watch intent detection, service discovery, dependency analysis
4. **Unified Journey** — See the service timeline with dependencies
5. **Interoperability** — Submit an application through the Integration Gateway
6. **Failure Demo** — Take Fire Safety API offline, show retry mechanism
7. **Recovery** — Bring service back online, show auto-recovery
8. **Government Dashboard** — Switch to admin view, show analytics and bottleneck analysis

### Simulation Controls
Navigate to **Admin → Simulation** to:
- Toggle individual service availability
- Run the SIH Demo Mode
- Restore all services
- Simulate partial or total outages

---

## 📁 Project Structure

```
onegov/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Demo data seeder
├── src/
│   ├── app/
│   │   ├── api/               # REST API routes
│   │   │   ├── auth/          # Login, logout, register
│   │   │   ├── journeys/      # Journey CRUD + submission
│   │   │   ├── services/      # Service registry
│   │   │   ├── integrations/  # Health monitoring
│   │   │   ├── admin/         # Admin stats, audit
│   │   │   └── notifications/ # Notification management
│   │   ├── citizen/           # Citizen-facing pages
│   │   ├── officer/           # Officer dashboard
│   │   ├── admin/             # Admin dashboard
│   │   └── login/             # Authentication
│   ├── components/            # Shared UI components
│   └── lib/
│       ├── auth.ts            # JWT authentication
│       ├── db.ts              # Database client
│       ├── utils.ts           # Utility functions
│       ├── ai/                # AI service discovery
│       ├── workflow/          # Workflow engine
│       ├── integrations/      # Gateway + adapters
│       ├── notifications/     # Notification service
│       ├── audit/             # Audit logging
│       └── consent/           # Consent management
├── .env.example               # Environment template
└── README.md
```

---

## 🔌 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/register` | Register new citizen |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Journeys
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/journeys` | List journeys (role-aware) |
| GET | `/api/journeys?id=` | Get journey with steps |
| POST | `/api/journeys/new` | Create journey from intent |
| POST | `/api/journeys/submit` | Submit step to external service |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List all services |

### Integration
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/integrations/health` | Get service health |
| POST | `/api/integrations/health` | Toggle service status (admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/audit` | Audit logs with pagination |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| PATCH | `/api/notifications` | Mark as read |

---

## 🔮 Future Scope

1. **Real Government API Integration** — Connect with actual government platforms
2. **Advanced AI** — LLM-powered intent understanding and document analysis
3. **Multilingual Support** — Hindi, Marathi, and regional languages
4. **Mobile PWA** — Progressive Web App for mobile access
5. **Predictive Analytics** — Predict delays and bottlenecks
6. **Blockchain** — Immutable audit trail for consent and submissions
7. **Voice Interface** — Voice-based service discovery
8. **eSign Integration** — Digital signature for document verification
9. **Payment Gateway** — Integrated fee payment across departments
10. **Cross-State** — Extend to other Indian states

---

## ⚠️ Important Notes

- This is a **prototype for SIH 2026**. External government system integrations are **mock implementations** demonstrating the architecture.
- All data shown in analytics is **prototype simulation metrics** unless explicitly marked as real data.
- The system is designed so mock adapters can be **replaced with real API integrations** without rewriting the core platform.

---

## 📄 License

Built for Smart India Hackathon 2026 — Problem Statement SIH26129

Government of Maharashtra | Software Category | Smart Automation Theme
