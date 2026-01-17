import { pgTable, text, doublePrecision, boolean, timestamp, json, integer, serial } from 'drizzle-orm/pg-core';

export const transactions = pgTable('transactions', {
    id: text('id').primaryKey(),
    date: text('date').notNull(),
    type: text('type').notNull(), // 'income' | 'expense' | 'investment'
    category: text('category').notNull(),
    amount: doublePrecision('amount').notNull(),
    description: text('description').notNull(),
    isRecurring: boolean('is_recurring').notNull(),
    recurringId: text('recurring_id'),
    acknowledged: boolean('acknowledged').notNull(),
    createdAt: text('created_at').default('now()'),
});

export const recurringTransactions = pgTable('recurring_transactions', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    category: text('category').notNull(),
    amount: doublePrecision('amount').notNull(),
    recurrence: json('recurrence').notNull(), // RecurrencePattern
    startDate: text('start_date').notNull(),
    autoAcknowledge: boolean('auto_acknowledge').notNull(),
    lastGenerated: text('last_generated'),
    lastAcknowledged: text('last_acknowledged'),
    isActive: boolean('is_active').notNull(),
});

export const stocks = pgTable('stocks', {
    ticker: text('ticker').primaryKey(),
    companyName: text('company_name').notNull(),
    sector: text('sector').notNull(),
    currentPrice: doublePrecision('current_price').notNull(),
    priceChange: doublePrecision('price_change').notNull(),
    priceChangeAmount: doublePrecision('price_change_amount').notNull(),
    marketCap: doublePrecision('market_cap').notNull(),
    weekRange52: json('week_range_52').notNull(), // { low, high }
    recommendation: json('recommendation').notNull(), // Recommendation
    fundamentals: json('fundamentals').notNull(), // FundamentalMetrics
    technicals: json('technicals').notNull(), // TechnicalIndicators
    historicalPrices: json('historical_prices').notNull(), // Array
});

export const goals = pgTable('goals', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    currentAmount: doublePrecision('current_amount').notNull(),
    targetAmount: doublePrecision('target_amount').notNull(),
    targetYear: doublePrecision('target_year').notNull(),
    status: text('status').notNull(), // 'todo' | 'in-progress' | 'achieved'
    monthlyContribution: doublePrecision('monthly_contribution').notNull(),
});

export const assets = pgTable('assets', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    currentValue: doublePrecision('current_value').notNull(),
    purchaseValue: doublePrecision('purchase_value').notNull(),
    purchaseDate: text('purchase_date').notNull(),
    location: text('location'),
    notes: text('notes'),
});

export const banks = pgTable('banks', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    last4: text('last4').notNull(),
    balance: doublePrecision('balance').notNull(),
    primary: boolean('primary').notNull(),
});

export const brokers = pgTable('brokers', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    status: text('status').notNull(),
    lastSync: text('last_sync').notNull(),
    syncEnabled: boolean('sync_enabled').notNull(),
});

export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(), // 'income' | 'expense' | 'asset'
});

export const liabilities = pgTable('liabilities', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    totalAmount: doublePrecision('total_amount').notNull(),
    outstandingAmount: doublePrecision('outstanding_amount').notNull(),
    interestRate: doublePrecision('interest_rate').notNull(),
    monthlyPayment: doublePrecision('monthly_payment'), // Added EMI
    startDate: text('start_date').notNull(),
    endDate: text('end_date'),
    notes: text('notes'),
});
