# Campus Service Ticketing System (CSMS)

SLA-based campus service ticketing platform for university IT and facilities support.

> Status: team project with active production-oriented hardening in progress.  
> This is not yet a production deployment.

## Overview

CSMS allows students and faculty to raise campus service tickets for issues such as
WiFi, hardware, AV equipment, electrical, plumbing, and housekeeping. Tickets are
routed to service staff, tracked against SLA deadlines, escalated on breach, and
resolved with proof-of-work attachments. Requesters can rate resolved tickets, and
administrators can view department and staff performance analytics.

The backend is a Spring Boot modular monolith. The frontend is a React + TypeScript
SPA. MySQL schema evolution is managed with Flyway.

## Key Features

- Role-based dashboards for six user roles
- Ticket creation, assignment, status tracking, comments, and attachments
- Least-loaded staff auto-assignment within department/sub-department
- Hierarchical SLA rule lookup and scheduled breach detection
- Multi-level escalation to department admin, admin, and super admin
- Mandatory proof-photo attachment before staff resolves/closes a ticket
- SLA change-request approval workflow
- Requester feedback ratings and explainable staff/department health scores
- Audit logs, ticket history, notifications, and asset service history

## User Roles

| Role | Purpose |
|---|---|
| SUPER_ADMIN | System configuration, SLA rules, escalation rules, calendar, audit logs |
| ADMIN | Users, staff, departments, categories, assets, all tickets |
| DEPARTMENT_ADMIN | Department-scoped tickets and staff management |
| STAFF | Works on assigned tickets; must upload proof before resolution |
| FACULTY | Raises tickets with elevated priority handling |
| STUDENT | Raises standard-priority tickets |

## Tech Stack

### Backend
- Java 21
- Spring Boot 3.4
- Spring Security, JWT
- Spring Data JPA
- Flyway
- MySQL
- Maven
- springdoc-openapi

### Frontend
- React 19
- TypeScript
- Vite
- TanStack Query
- React Router
- Tailwind CSS
- Axios
- Recharts

### Infrastructure
- Docker / Docker Compose
- GitHub Actions (in progress)

## Architecture

The backend follows a package-by-feature modular monolith structure:

```text
com.csms
├── auth
├── user
├── role
├── staff
├── department
├── subdepartment
├── ticket
├── sla
├── escalation
├── notification
├── comment
├── attachment
├── feedback
├── history
├── audit
├── report
├── asset
├── calendar
├── priority
├── issuecategory
└── common
