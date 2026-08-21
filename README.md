# 🏢 Organa


Organa is a workspace platform for managing organizations, teams and shared knowledge.


Users can create organizations, manage areas and documents, and collaborate through a role-based membership system.


## 🚀 Features


🔐 Authentication with Auth.js Credentials + bcrypt  
🏢 Organization management  
👥 Membership system with ADMIN and MEMBER roles  
📩 Join request workflow  
📁 Areas management  
📄 Documents management  
🔒 Server-side authorization  
⚡ Server Actions  
🔄 Database transactions  


## 🧠 Key Concepts


This project focuses on building a secure multi-organization architecture:


- Authentication and protected routes
- Role-based authorization
- Organization-based data isolation
- Server-side user identification
- Relational data modeling with Prisma
- Atomic database operations with transactions
- CRUD operations through Server Actions


## 🛠 Tech Stack


**Frontend**


- Next.js 16
- React 19
- TypeScript
- Tailwind CSS


**Backend**


- Next.js Server Actions
- Auth.js
- Prisma 7
- PostgreSQL
- Neon
- bcrypt


## 🧩 Data Model


The application is built around the following relationships:


```text
User
  ↓
Membership
  ↓
Organization
  ↓
Area
  ↓
Document


User ─── JoinRequest ─── Organization

Memberships connect users to organizations and define their role.

Join requests allow users to request access to organizations and follow an approval workflow:

PENDING → APPROVED → MEMBER
        ↘ REJECTED
🔐 Authorization

All protected operations verify the current user's session and organization membership server-side.

The user ID is always retrieved from the authenticated session rather than trusted from client input.

Role-based permissions distinguish between ADMIN and MEMBER operations.

⚙️ Architecture
app/          → Next.js pages and routes
actions/      → Server Actions
lib/          → shared utilities and Prisma client
prisma/       → database schema and migrations
auth.ts       → Auth.js configuration
🎯 Project Goal

The goal of Organa is to provide a simple and structured workspace where organizations can manage their internal knowledge through areas and documents while maintaining clear membership and authorization rules.

📌 Status

Project in development — MVP stage.

👤 Author

Nazario Biscotti
