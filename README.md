# Payment Gateway Platform – Multi-Method Processing & Hosted Checkout

## Project Description

This project is a **production-ready Payment Gateway platform** inspired by real-world systems like **Razorpay** and **Stripe**.

It enables merchants to securely create payment orders via APIs and allows customers to complete payments through a **hosted checkout page** supporting **UPI** and **Card** payments.

The system is designed with clean architecture, strict validation logic, and realistic payment lifecycle management, making it suitable for **fintech learning**, **backend system design evaluation**, and **full-stack development demonstrations**.

---

## Key Features

- Merchant authentication using **API Key & API Secret**
- Automatic **test merchant seeding** on startup
- Secure **order creation and retrieval APIs**
- **Multi-method payment processing**
  - **UPI payments**
    - VPA validation
  - **Card payments**
    - Luhn algorithm validation
    - Expiry date validation
    - Card network detection (Visa, Mastercard, Amex, RuPay)
- **Hosted Checkout Page** for customers
- **Payment lifecycle management**
  - `processing → success / failed`
- **Deterministic Test Mode** for predictable success/failure
- **Merchant Dashboard**
  - API credentials
  - Transaction statistics
  - Transaction history
- Fully **Dockerized architecture** with one-command startup
- **Health check endpoint** for service monitoring
- Responsive and clean UI for dashboard and checkout

---

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd payment-gateway

# Start all services
docker-compose up -d --build


## Access URLs

| Service | URL |
|--------|-----|
| Merchant Dashboard | http://localhost:3000 |
| Checkout Page | http://localhost:3001 |
| Backend API | http://localhost:8000 |
| Health Check | http://localhost:8000/health |

---

## Test Merchant Credentials

The application automatically seeds a **test merchant** on startup.

Email: test@example.com

API Key: key_test_abc123  
API Secret: secret_test_xyz789  

Use these credentials for all authenticated API requests and dashboard access.

---

## Test Payment Details

### UPI

```text
user@paytm
test@phonepe

### Card (Visa – Recommended)

```text
Card Number: 4111 1111 1111 1111
Expiry: 12/26
CVV: 123
Name: Test User


## Project Structure

├── backend/            # Node.js + Express API
├── frontend/           # Merchant Dashboard (React)
├── checkout-page/      # Hosted Checkout (React)
├── docker-compose.yml
├── .env.example
└── README.md



---

## Services

| Service | Port | Description |
|--------|------|-------------|
| Backend API | 8000 | Payment gateway logic |
| Dashboard | 3000 | Merchant-facing UI |
| Checkout | 3001 | Customer payment UI |
| PostgreSQL | 5432 | Persistent database |

---

## Technology Stack

### Frontend
- React.js (Vite)
- React Router DOM
- Fetch API
- Custom CSS
- Nginx (production build)

### Backend
- Node.js (v18)
- Express.js
- Custom validation utilities
- Environment-based configuration

### Database
- PostgreSQL (v15)

### DevOps & Containerization
- Docker
- Docker Compose
- Nginx

---

## Architecture Overview

The system follows a **service-oriented architecture**:

### Merchant Dashboard (React)
Used by merchants to view API credentials, statistics, and transactions.

### Checkout Page (React)
A public-facing hosted checkout used by customers to complete payments.

### Backend API (Express)
Handles authentication, order management, payment processing, validation, and lifecycle state transitions.

### Database (PostgreSQL)
Stores merchants, orders, payments, and related metadata with proper relationships and indexes.

---

## Architecture Diagrams

*(To be added)*

- System Architecture Diagram  
- Database ER Diagram  

---

## Environment Configuration

Create a `.env` file using the following template:

```env
DATABASE_URL=postgresql://gateway_user:gateway_pass@postgres:5432/payment_gateway
PORT=8000

# Test merchant (auto-seeded)
TEST_MERCHANT_EMAIL=test@example.com
TEST_API_KEY=key_test_abc123
TEST_API_SECRET=secret_test_xyz789

# Payment simulation
TEST_MODE=false
TEST_PAYMENT_SUCCESS=true
TEST_PROCESSING_DELAY=1000

A sample file is provided as `.env.example`.

---

## Payment Flow

1. Merchant creates an order via API  
2. Customer is redirected to hosted checkout  
3. Customer selects payment method (UPI / Card)  
4. Payment enters `processing` state  
5. Backend simulates bank processing  
6. Payment resolves to:
   - **Success** → `/success`
   - **Failure** → `/failure`
7. Merchant can view the transaction in the dashboard  

---

## Testing Failure Scenarios

To force all payments to fail (for demo or evaluation):

```env
TEST_MODE=true
TEST_PAYMENT_SUCCESS=false

Restart only the backend service:

```bash
docker-compose restart api

## Health Check

Verify backend readiness:

```bash
curl http://localhost:8000/health

Expected response:

```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "..."
}
