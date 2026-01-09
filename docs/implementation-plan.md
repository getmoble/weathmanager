# Wealth Manager - Implementation Plan

A comprehensive financial management platform that helps you track income, expenses, and investments while providing intelligent insights for expense reduction and investment opportunities.

## Overview

Wealth Manager is a Next.js 16 application that serves as your personal financial assistant. It tracks your monthly finances, automates recurring transactions, analyzes spending patterns to suggest savings, and recommends investment opportunities based on fundamental and technical analysis.

## Core Features

### 1. Financial Tracking
- **Income Tracking**: Monitor all income sources with categorization and trends
- **Expense Management**: Track expenses with smart categorization and reduction suggestions
- **Investment Portfolio**: Track investments, monitor performance, and analyze returns

### 2. Recurring Transactions
- Set up recurring income (salary, freelance payments, etc.)
- Set up recurring expenses (rent, subscriptions, utilities, etc.)
- System auto-generates transactions each month on specified dates
- Acknowledgment system to confirm when transactions actually occur
- Edit or delete recurring patterns anytime

### 3. Smart Entry Methods
- **Manual Entry**: Traditional form-based transaction entry
- **Screenshot/Receipt Scan**: Paste or upload receipt images, OCR extracts details automatically
- Category suggestions based on merchant/description

### 4. Intelligent Insights
- **Expense Reduction Suggestions**: AI analyzes spending patterns and suggests where to save
- **Investment Opportunities**: Real-time stock analysis with buy/sell recommendations
- **Monthly Reports**: Visual breakdown of income, expenses, and investment performance

### 5. Investment Analysis
- **Simplified Fundamental Analysis**: Company size, valuation, "too big to fail" indicator, historical track record, personal trust score
- **Technical Analysis**: SMA, RSI, MACD with visual charts
- **Recommendation Engine**: Clear buy/sell/hold signals with reasoning

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | Next.js 16 (latest) with App Router |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | Shadcn UI |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **OCR** | Tesseract.js |
| **Date Handling** | date-fns |
| **State Management** | React Context API |
| **Authentication** | Hardcoded (admin/admin) for local development |

---

## Application Structure

```
e:/wealthmanager/
├── app/
│   ├── login/
│   │   └── page.tsx                    # Login page
│   ├── dashboard/
│   │   ├── layout.tsx                  # Dashboard shell with sidebar
│   │   ├── page.tsx                    # Overview dashboard
│   │   ├── income/
│   │   │   └── page.tsx                # Income dashboard
│   │   ├── expenses/
│   │   │   └── page.tsx                # Expense dashboard with suggestions
│   │   ├── investments/
│   │   │   └── page.tsx                # Investment dashboard
│   │   ├── opportunities/
│   │   │   ├── page.tsx                # Stock opportunities list
│   │   │   └── [ticker]/
│   │   │       └── page.tsx            # Stock detail page
│   │   ├── recurring/
│   │   │   └── page.tsx                # Recurring transactions management
│   │   ├── reports/
│   │   │   └── page.tsx                # Monthly financial reports
│   │   └── settings/
│   │       └── page.tsx                # Settings page
│   ├── api/
│   │   ├── stocks/
│   │   │   ├── route.ts                # GET all stocks
│   │   │   └── [ticker]/
│   │   │       └── route.ts            # GET stock details
│   │   ├── transactions/
│   │   │   └── route.ts                # GET/POST transactions
│   │   ├── recurring/
│   │   │   └── route.ts                # CRUD recurring transactions
│   │   ├── suggestions/
│   │   │   └── expenses/
│   │   │       └── route.ts            # GET expense reduction suggestions
│   │   └── orders/
│   │       └── route.ts                # POST buy/sell orders
│   └── globals.css                     # Global styles with Tailwind
├── components/
│   ├── AuthContext.tsx                 # Authentication context
│   ├── AddTransactionDialog.tsx        # Transaction entry with OCR
│   ├── StockCard.tsx                   # Stock opportunity card
│   ├── RecommendationBadge.tsx         # Buy/Sell/Hold badge
│   ├── MetricCard.tsx                  # Dashboard metric card
│   ├── AnalysisChart.tsx               # Technical analysis charts
│   ├── TransactionTable.tsx            # Transaction list table
│   ├── RecurringTransactionCard.tsx    # Recurring transaction item
│   ├── ExpenseReductionSuggestion.tsx  # Expense suggestion card
│   └── LoadingSpinner.tsx              # Loading indicator
├── lib/
│   ├── fundamentalAnalysis.ts          # Simplified fundamental analysis
│   ├── technicalAnalysis.ts            # Technical indicators (SMA, RSI, MACD)
│   ├── recommendationEngine.ts         # Buy/sell recommendation logic
│   ├── expenseAnalysis.ts              # Expense pattern analysis
│   ├── recurringTransactionManager.ts  # Auto-generation & acknowledgment
│   ├── ocrUtils.ts                     # OCR processing with Tesseract.js
│   ├── mockStockData.ts                # Mock stock data (~20-30 companies)
│   ├── mockTransactionData.ts          # Mock transaction data
│   └── utils.ts                        # Shadcn utilities
├── types/
│   └── types.ts                        # TypeScript type definitions
├── docs/
│   └── implementation-plan.md          # This document
├── tailwind.config.ts                  # Tailwind configuration
├── components.json                     # Shadcn UI configuration
└── package.json                        # Dependencies
```

For the complete detailed implementation guide including all page specifications, algorithms, data models, and verification plan, see the full implementation plan document.

---

## Quick Start Guide

### 1. Create Next.js 16 Project
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-git
```

### 2. Install Dependencies
```bash
npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge
npm install recharts lucide-react date-fns tesseract.js
npm install -D @types/node @types/react @types/react-dom
```

### 3. Initialize Shadcn UI
```bash
npx shadcn@latest init
npx shadcn@latest add card button input label select tabs dialog table badge alert dropdown-menu avatar
```

### 4. Start Development
```bash
npm run dev
```

---

## Navigation Structure

1. **Home** - Overview dashboard
2. **Income** - Income tracking and analysis
3. **Expenses** - Expense tracking with reduction suggestions
4. **Investments** - Portfolio and performance
5. **Opportunities** - Stock analysis and recommendations
6. **Reports** - Monthly financial reports
7. **Recurring** - Manage recurring transactions
8. **Settings** - User preferences

---

## Key Pages Overview

### Overview Dashboard
- Total Income, Expenses, Investments, Available Cash
- Monthly trend chart
- Recent transactions
- Pending recurring acknowledgments

### Expense Dashboard
- Expense summary and charts
- **Expense Reduction Suggestions** (AI-powered insights)
- Transaction table with OCR-powered entry

### Investment Dashboard
- Portfolio overview
- **Top Investment Opportunities**
- Performance charts

### Stock Opportunities
- Stock list with filters/search
- Detailed analysis with fundamental + technical tabs
- Buy/sell/hold recommendations with reasoning

### Recurring Transactions
- Manage recurring income/expenses
- Auto-generation system
- Acknowledgment queue

---

## Development Phases

1. ✅ Setup & Authentication (2 hours) - **COMPLETED**
2. ✅ Dashboard Structure (2 hours) - **COMPLETED**
3. [ ] Income Tracking (3 hours) - **IN PROGRESS**
4. [ ] Expense Tracking (5 hours) - **IN PROGRESS**
5. ✅ Recurring Transactions Logic (4 hours) - **COMPLETED**
6. [ ] Investment Tracking (3 hours)
7. ✅ Stock Analysis Logic (6 hours) - **COMPLETED**
8. [ ] Monthly Reports (3 hours)
9. [ ] Polish & Testing (4 hours)

**Total Estimated Time**: 32 hours

---

## Success Criteria

### Functional Requirements
- ✅ Users can log in with admin/admin
- ✅ Users can track income, expenses, and investments
- ✅ Users can set up recurring transactions
- ✅ System auto-generates recurring transactions
- ✅ Users can paste receipts and have data extracted via OCR
- ✅ System provides expense reduction suggestions
- ✅ System recommends investment opportunities
- ✅ Users can view detailed stock analysis
- ✅ Users can generate monthly financial reports

### Technical Requirements
- ✅ Built with Next.js 16, TypeScript, Tailwind CSS, Shadcn UI - **DONE**
- ✅ Fully responsive design - **DONE**
- ✅ Dark theme with vibrant accents - **DONE**
- [ ] Fast page loads (<1s)
- [ ] Smooth animations and transitions

---

For detailed specifications of each component, data models, algorithms, and verification steps, refer to the complete implementation plan in the artifact or brain folder.
