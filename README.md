# 🚀 Mini Enterprise Collaboration and Workflow Platform

A complete Enterprise Workflow Management Platform built using FastAPI, React, MySQL, SQLAlchemy, JWT Authentication, WebSockets, and SaaS-level architecture concepts.

The platform enables organizations to manage tasks, approvals, documents, notifications, audit logs, AI insights, subscriptions, billing, and enterprise collaboration workflows.

---

# 📌 Features

## 🔐 Authentication & Security

- JWT Authentication
- Role Based Access Control
- Employee / Manager / Admin Roles
- Password Reset Flow
- OAuth Integration Foundation
- Protected APIs

---

## ✅ Task Management System

- Create Tasks
- Update Tasks
- Delete Tasks
- Assign Tasks
- Task Priorities
- Task Status Tracking
- Task Ownership

---

## 📋 Kanban Workflow Board

Task lifecycle management:

Todo → In Progress → Review → Done

Features:

- Manager task visibility
- Employee assigned task visibility
- Role based filtering

---

## 💬 Comment Module

Features:

- Add comments
- Internal comments
- Employee restrictions
- Role based visibility

---

## 📁 Document Management System

Features:

- Upload Documents
- Download Documents
- Version Control
- Document History
- Task-wise Document Storage

---

## 🔔 Notification System

Features:

- Real Time Notifications
- WebSocket Integration
- Notification Read Tracking

---

## 📊 Audit Logging

Tracks:

- Task Activities
- Approval Activities
- User Actions
- Entity Changes

---

## 📈 Activity Tracking Module

Tracks enterprise workflow activities:

- User Operations
- System Events
- Workflow Monitoring

---

## 🧠 AI Insights Module

Provides:

- Enterprise Insights
- Analytics Foundation
- AI Driven Workflow Intelligence

---

## ✅ Approval Workflow Module

Workflow:

Employee → Manager → Admin

Features:

- Approval Requests
- Approve / Reject / Hold
- Mandatory Rejection Comments
- Approval History
- Audit Trail

---

## 🏢 Organization Module

Features:

- Organization Creation
- Organization Plans
- Credits Tracking
- SaaS Foundation

---

## 💳 Billing Module

Features:

- Stripe Integration
- Payment Intent Creation
- Billing Workflow Foundation

---

## 🚀 Subscription Module

Available Plans:

- Basic
- Silver
- Gold

Features:

- Plan Upgrade
- Credits Allocation
- Subscription Tracking

---

## 💰 Credit Based Usage System

Features:

- Credit Allocation
- Credit Deduction
- Organization Credit Management

---

# 🏗️ Architecture

Backend:

- FastAPI
- SQLAlchemy
- MySQL
- JWT
- WebSocket
- Stripe API

Frontend:

- React.js
- Axios
- React Router
- Dashboard UI

---

# 🔧 Tech Stack

Backend:

- Python
- FastAPI
- SQLAlchemy
- MySQL
- JWT Authentication

Frontend:

- React.js
- JavaScript
- CSS

Infrastructure:

- WebSocket
- Stripe
- SaaS Architecture Concepts

---

# 📂 Project Structure

```

backend/
│
├── models/
├── routers/
├── services/
├── schemas/
├── uploads/
├── websocket/
│

frontend/
│
├── pages/
├── components/
├── services/

```

---

# 🚀 Setup

Backend:

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend

npm install

npm start
```

---

# 🔐 Environment Variables

Create .env file:

```env
STRIPE_SECRET_KEY=your_secret_key
```

---

# 📸 Workflow Screenshots

- Login
- Dashboard
- Task Creation
- Kanban Board
- Approval Workflow
- Document Upload
- Notification System
- Billing
- Subscription

---

# 🎯 Enterprise Workflow

User Login

↓

Task Management

↓

Comments

↓

Approval Workflow

↓

Audit Logs

↓

Notifications

↓

Document Management

↓

Analytics

↓

Billing & Subscription

---

# 📌 Future Enhancements

- Full Multi Tenant Isolation
- Redis Caching
- Database Optimization
- Advanced AI Analytics
- Enterprise Deployment

---



Mini Enterprise Collaboration and Workflow Platform
