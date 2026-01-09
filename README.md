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
- **🇮🇳 Localization**: Full support for Indian Rupee (₹) and `en-IN` number formatting.

## 🏗️ Architecture

The application uses a **Mock API Architecture** to simulate a real-world production environment:

- **Data Service Layer**: Centralized [`lib/dataService.ts`](file:///e:/weathmanager/weathmanager/lib/dataService.ts) handles all data fetching asynchronously.
- **Externalized Data**: All mock data is stored as JSON files in [`public/data/`](file:///e:/weathmanager/weathmanager/public/data/), allowing for easy updates and future backend integration.
- **Tech Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Recharts, Tesseract.js.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Access the App**:
   Open [http://localhost:3000](http://localhost:3000) and login with `admin`/`admin`.

## 📂 Documentation

- [Product Requirements](file:///e:/weathmanager/weathmanager/docs/requirements.md)
- [Implementation Plan](file:///e:/weathmanager/weathmanager/docs/implementation-plan.md)
- [Tasks & Roadmap](file:///e:/weathmanager/weathmanager/docs/tasks.md)

