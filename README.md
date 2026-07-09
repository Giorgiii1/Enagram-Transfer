# Enagram Transfer Hub

Enagram is a modern, high-fidelity simulated bank transfer dashboard built with **Clean Architecture** on a **.NET 10 API** and a **React + Tailwind CSS** frontend, fully orchestrable using **Docker Compose**.

---

## 🚀 Tech Stack

- **Backend**: C# .NET 10, Entity Framework Core, Web API, SQL Server.
- **Frontend**: React 18, Vite, Tailwind CSS, Axios, Lucide Icons.
- **Database**: Microsoft SQL Server.
- **Deployment**: Docker, Multi-Stage Dockerfiles, Docker Compose, Nginx.

---

## 🛠️ Architecture Overview

The backend is built adhering to Clean Architecture principles:
- **Domain**: Pure enterprise business models (`Account`, `Transaction`) and domain validation rules.
- **Application**: Application logic and contracts split cleanly into:
  - **DTOs**: Specific data transfer models (`TransferRequestDto`, `AccountResponseDto`, `TransactionResponseDto`) to ensure controllers never expose or accept raw domain entities directly.
  - **Services**: Application services and interfaces (`ITransferService` and `TransferService`) encapsulating decoupled orchestration logic.
- **Infrastructure**: Entity Framework Core DbContext configurations, fluent maps, and database seed logic.
- **API (Controllers)**: Controllers (e.g. `AccountsController`) mapping request endpoints and interacting exclusively with DTOs.

The frontend is a lightweight, high-performance React application styled with rich glassmorphism:
- Renders virtual credit card components with dynamically selected gradient patterns.
- Displays a unified transaction ledger showing readable names mapped from Guid identifiers.
- Protects balance constraints with client-side balance validation.

---

## 📦 How to Run

To run the entire system (Database, Web API, and Frontend React App) locally, simply execute the following command in the project root:

```bash
docker-compose up --build
```

- **Frontend Hub**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Database Port**: `1433` (accessible via SQL Server Management Studio)

---

## 💳 Seed Data

Upon startup, the database is automatically created and seeded with the following three test accounts:

1. **John Doe**
   - **Account ID**: `0190562e-503c-7bf0-aa46-13a5a4dc2c40`
   - **Initial Balance**: `$1,000.00`
2. **Jane Smith**
   - **Account ID**: `0190562e-503c-7bf0-aa46-13a5a4dc2c41`
   - **Initial Balance**: `$500.00`
3. **Bob Johnson**
   - **Account ID**: `0190562e-503c-7bf0-aa46-13a5a4dc2c42`
   - **Initial Balance**: `$0.00`

---

## 📝 Features & Functionality

1. **Real-time Synchronization**: Initiating a transfer automatically recalculates total system balances, syncs transaction logs, and updates credit card cards dynamically.
2. **Client Validation**: Prevents transfers between identical accounts, zero/negative transfers, or transfers exceeding account balances.
3. **Startup Resilience**: The Web API features database retry loops that wait for SQL Server to boot completely inside Docker before migrating/seeding the tables.
