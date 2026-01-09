# Wealth Manager - Product & Technical Requirements

## 1. Project Overview
Wealth Manager is a comprehensive personal finance platform tailored for the **Indian context**. It simplifies wealth management by providing automated tracking, intelligent spending insights, and professional-grade stock analysis tools.

---

## 2. Core Functionalities

### 2.1 Financial Tracking System
The system handles three primary types of financial flows:
- **Income**: Tracking salary, dividends, and other inflows.
- **Expenses**: Categorized spending with automated categorization.
- **Investments**: Equity-focused portfolio tracking.

### 2.2 Advanced Transaction Entry System
To provide maximum flexibility, the platform offers three distinct entry methods:
1. **Single Entry**: A focused form for adding a single manual transaction (Income/Expense/Investment).
2. **Bulk Entry**: An Excel-like grid interface for rapid multi-row transaction logging.
3. **Smart Scan (OCR)**: 
   - **Step 1**: Paste or upload screenshot/receipt.
   - **Step 2**: AI analysis via Tesseract.js.
   - **Step 3**: Review list for editing/deleting detected transactions before final submission.

### 2.3 Intelligent Expense Analysis
The `expenseAnalysis` engine generates `ExpenseSuggestion` objects:
- **Spike Detection**: Alerts if current category spending is >20% higher than the 3-month average.
- **Subscription Tracker**: Identifies recurring digital payments and suggests potential cancellations.
- **Frequency Analysis**: Tracks "lifestyle creep" (e.g., excessive dining frequency).

### 2.4 Investment & Stock Analysis Engine
A two-tier analysis system provides professional-grade recommendations.

#### Fundamental Analysis
Scores companies (0-100) based on:
- **Company Size**: Mega, Large, Mid, Small Cap tiers (using ₹ Crore denominations).
- **TBTF Score**: "Too Big To Fail" rating (0-10) for systemic stability.
- **Valuation**: Current price vs. 5-year average valuation benchmarks.

#### Technical Analysis
Uses 200+ days of historical data:
- **SMA 50/200**: Golden/Death cross detection and price position mapping.
- **RSI (14)**: Identifies Oversold (<30) and Overbought (>70) conditions.
- **MACD**: Signal vs. Value histogram comparison.

#### Recommendation Logic
- **Weights**: 60% Fundamental / 40% Technical.
- **Actions**:
  - **BUY**: Score >= 70
  - **SELL**: Score <= 40
  - **HOLD**: Score between 40 and 70.

### 2.5 Advanced Management & Settings
Centralized management for financial entities and metadata:
- **Bank Accounts**: Link and track multiple bank accounts and cards with localized balance views.
- **Dynamic Categories**: Fully customizable Income and Expense category lists.
- **Broker Integration**: Management layer for connecting and syncing with Indian stock brokers (e.g., Zerodha, Upstox).

---

## 3. Application Architecture

### 3.1 Data Architecture (Mock API)
The application implements an **API-first abstraction layer** even while running with local data:
- **Service Pattern**: All components consume data via the `DataService`, which abstracts the underlying data source.
- **JSON Store**: Mock data is externalized into JSON files located in `public/data/` (e.g., `transactions.json`, `stocks.json`).
- **Async Flow**: Fetches are performed via asynchronous `fetch` calls to local routes, ensuring the UI develops reactive loading patterns ready for real REST/GraphQL integration.

### 3.2 Page Specifications
- **Overview Dashboard**: High-level metrics for Total Income, Expenses, and Net Worth.
- **Opportunities List**: Searchable grid of analyzed stocks with real-time badges.
- **Stock Detail**: Tabbed view for deep Fundamental vs. Technical data visualization.
- **Recurring Manager**: A stateful acknowledge/ignore system for automated transactions.
- **Monthly Reports**: Generates a **Financial Health Score** based on savings rate and investment allocation.

### 3.2 UI/UX Principles
- **Aesthetic**: Premium design with full support for **Dark and Light modes**. Use vibrant accents (Emerald for income, Rose for expenses, Blue for investments).
- **Theme Management**: Persistent theme selection using `next-themes`, defaulting to dark.
- **Responsiveness**: Mobile-first design using Shadcn UI components.
- **Localization**: All currency displayed in `₹` using `toLocaleString('en-IN')`.

---

## 4. Data Models

### Transaction
```typescript
interface Transaction {
  id: string;
  date: string; // ISO format
  type: 'income' | 'expense' | 'investment';
  category: string;
  amount: number;
  description: string;
  isRecurring: boolean;
  acknowledged: boolean;
}
```

### Stock Analysis
```typescript
interface Stock {
  ticker: string;
  recommendation: {
    action: 'buy' | 'sell' | 'hold';
    confidence: number;
    reasoning: string;
  };
  fundamentals: FundamentalMetrics;
  technicals: TechnicalIndicators;
}
```

---

## 5. Verification & Quality Standards
- **Performance**: Page transitions < 1s; OCR processing < 3s.
- **Accuracy**: Recommendation logic must handle edge cases (e.g., missing price history).
- **Security**: Hardcoded `admin/admin` logic for prototype; AuthProvider persists state in `localStorage`.
