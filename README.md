# Wealth Manager 🇮🇳

A premium personal finance and wealth orchestration platform tailored for the Indian market. Track income, manage expenses with AI-powered insights, and analyze Indian equities with professional-grade technical and fundamental engines.

## ✨ Key Features

- **🌓 Dynamic Theme Switching**: Seamlessly toggle between Light and Dark modes with persistent user preference.
- **⚙️ Premium Settings Experience**: Redesigned **Vertical Tabs** layout for managing Bank Accounts, Brokers, and separate Income/Expense categories with fixed heights for UI stability.
- **🧭 Optimized Navigation**: Reorganized sidebar logic focusing on high-priority modules (Overview > Opportunities > Goals).
- **📊 Professional Analysis**:
  - **Fundamental**: Scoring based on Market Cap tiers, TBTF (Too Big To Fail) rating, and valuation benchmarks.
  - **Technical**: Real-time indicators including SMA 50/200, RSI, and MACD.
- **📉 Smart Entry System**: Manual single entry, Excel-style bulk entry, and AI-powered OCR scanning for receipts/screenshots.
- **🎯 Goal Tracking**: Dedicated dashboard for monitoring life milestones with progress visualization and automated SIP tracking.
- **🏠 Asset Management**: Track non-equity holdings (Real Estate, Gold, Vehicles) with appreciation metrics and net-worth allocation.
- **🇮🇳 Localization**: Full support for Indian Rupee (₹) and `en-IN` number formatting.

## 🏗️ Architecture
 
 The application uses a **Modern Full-Stack Architecture** with real database persistence:
 
 - **Database Layer**: **PostgreSQL** managed via **Drizzle ORM** for type-safe database interactions.
 - **Server Actions**: Direct server-side logic in [`lib/actions.ts`](file:///c:/code/weathmanager/lib/actions.ts) for secure and efficient data mutations for all functional modules (Assets, Banks, Goals, etc.).
 - **Data Service**: Centralized data fetching patterns.
 - **Tech Stack**: Next.js 16 (App Router), TypeScript, Drizzle ORM, PostgreSQL, Tailwind CSS v4, Shadcn UI, Recharts, Tesseract.js.

## 🚀 Getting Started

1. **Install Dependencies**:
    ```bash
    npm install
    ```
 
 2. **Database Setup**:
    Ensure you have a PostgreSQL instance running (default: `postgres://postgres:postgres@127.0.0.1:5432/wealthmanager`).
    
    Sync the database schema:
    ```bash
    npm run db:push
    ```
    
    Seed initial data:
    ```bash
    npm run db:seed
    ```
 
 3. **Run Development Server**:
    ```bash
    npm run dev
    ```
 
 4. **Access the App**:
    Open [http://localhost:3000](http://localhost:3000) and login with `admin`/`admin`.

## 📂 Documentation

- [Product Requirements](file:///c:/code/weathmanager/docs/requirements.md)
- [Database Schema](file:///c:/code/weathmanager/lib/db/schema.ts)

