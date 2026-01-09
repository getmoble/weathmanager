export interface User {
  id: string;
  username: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO format
  type: 'income' | 'expense' | 'investment';
  category: string;
  amount: number;
  description: string;
  isRecurring: boolean;
  recurringId?: string; // Link to recurring transaction
  acknowledged: boolean; // For recurring transactions
  createdAt: string;
}

export interface RecurringTransaction {
  id: string;
  name: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  recurrence: RecurrencePattern;
  startDate: string;
  autoAcknowledge: boolean;
  lastGenerated?: string; // Last date transaction was generated
  lastAcknowledged?: string;
  isActive: boolean;
}

export interface RecurrencePattern {
  type: 'monthly' | 'weekly' | 'custom';
  dayOfMonth?: number; // 1-31 for monthly
  dayOfWeek?: number; // 0-6 for weekly
  intervalDays?: number; // For custom (every X days)
}

export interface Stock {
  ticker: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  priceChange: number; // % change today
  priceChangeAmount: number; // ₹ change today
  marketCap: number;
  weekRange52: { low: number; high: number };
  recommendation: Recommendation;
  fundamentals: FundamentalMetrics;
  technicals: TechnicalIndicators;
  historicalPrices: { date: string; price: number }[];
}

export interface FundamentalMetrics {
  companySize: 'mega' | 'large' | 'mid' | 'small'; // Based on market cap
  marketCapTier: string; // e.g., "Mega Cap (>$200B)"
  valuationStatus: 'undervalued' | 'fairly-valued' | 'overvalued';
  currentVsAverage: number; // % difference from 5-year avg price
  tooBigToFailScore: number; // 0-10
  tooBigToFailReason: string;
  historicalReturn5Y: number; // % return over 5 years
  consistency: 'high' | 'medium' | 'low';
  resilienceDuringDownturns: 'strong' | 'moderate' | 'weak';
  personalHistory: {
    investedBefore: boolean;
    timesInvested: number;
    pastReturns: number[]; // % returns from past investments
    trustScore: 'high' | 'medium' | 'low';
  };
  fundamentalScore: number; // 0-100
}

export interface TechnicalIndicators {
  sma50: number;
  sma200: number;
  rsi: number; // 0-100
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
  volumeAvg: number;
  volumeCurrent: number;
  technicalScore: number; // 0-100
}

export interface Recommendation {
  action: 'buy' | 'sell' | 'hold';
  confidence: number; // 0-100
  reasoning: string; // Human-readable explanation
}

export interface ExpenseSuggestion {
  id: string;
  category: string;
  currentSpending: number;
  averageSpending: number;
  percentageChange: number;
  suggestion: string;
  potentialSavings: number;
  priority: 'high' | 'medium' | 'low';
}

export interface MonthlyReport {
  month: string; // "2026-01"
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  netSavings: number;
  availableCash: number;
  incomeByCategory: { category: string; amount: number }[];
  expensesByCategory: { category: string; amount: number }[];
  comparisonWithPreviousMonth: {
    incomeChange: number; // %
    expensesChange: number; // %
    investmentsChange: number; // %
    savingsChange: number; // %
  };
}

export interface OCRResult {
  amount: number | null;
  date: string | null; // ISO format
  merchant: string | null;
  suggestedCategory: string | null;
  confidence: number; // 0-1
  rawText: string;
}
export interface Goal {
  id: string;
  name: string;
  description: string;
  currentAmount: number; // Present value of earmarked funds
  targetAmount: number; // Future value required
  targetYear: number;
  inflationRate: number;
  status: 'todo' | 'in-progress' | 'achieved';
  category: string;
  monthlyContribution: number;
  expectedReturn: number;
}
