import { Transaction, RecurringTransaction } from '@/types/types';

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        date: new Date().toISOString(),
        type: 'income',
        category: 'Salary',
        amount: 150000,
        description: 'Monthly Salary - HDFC Bank',
        isRecurring: true,
        acknowledged: true,
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        date: new Date(Date.now() - 86400000).toISOString(),
        type: 'expense',
        category: 'Food & Dining',
        amount: 1250,
        description: 'Zomato - Dinner Order',
        isRecurring: false,
        acknowledged: true,
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        date: new Date(Date.now() - 172800000).toISOString(),
        type: 'investment',
        category: 'Mutual Funds',
        amount: 25000,
        description: 'SIP - Quant Small Cap Fund',
        isRecurring: true,
        acknowledged: true,
        createdAt: new Date().toISOString()
    },
    {
        id: '4',
        date: new Date(Date.now() - 259200000).toISOString(),
        type: 'expense',
        category: 'Shopping',
        amount: 4500,
        description: 'Reliance Digital - Accessories',
        isRecurring: false,
        acknowledged: true,
        createdAt: new Date().toISOString()
    },
    {
        id: '5',
        date: new Date(Date.now() - 345600000).toISOString(),
        type: 'expense',
        category: 'Utilities',
        amount: 2800,
        description: 'BESCOM - Electricity Bill',
        isRecurring: true,
        acknowledged: true,
        createdAt: new Date().toISOString()
    },
    {
        id: '6',
        date: new Date(Date.now() - 432000000).toISOString(),
        type: 'expense',
        category: 'Transport',
        amount: 650,
        description: 'Uber - Office Commute',
        isRecurring: false,
        acknowledged: true,
        createdAt: new Date().toISOString()
    },
    {
        id: '7',
        date: new Date(Date.now() - 518400000).toISOString(),
        type: 'income',
        category: 'Dividend',
        amount: 1200,
        description: 'TCS - Interim Dividend',
        isRecurring: false,
        acknowledged: true,
        createdAt: new Date().toISOString()
    }
];

export const MOCK_RECURRING: RecurringTransaction[] = [
    {
        id: 'rec-1',
        name: 'Rent Payment',
        type: 'expense',
        category: 'Housing',
        amount: 35000,
        recurrence: { type: 'monthly', dayOfMonth: 5 },
        startDate: '2025-01-01',
        autoAcknowledge: false,
        isActive: true,
        lastGenerated: '2025-12-05'
    },
    {
        id: 'rec-2',
        name: 'Jio Fiber Fiber',
        type: 'expense',
        category: 'Utilities',
        amount: 1179,
        recurrence: { type: 'monthly', dayOfMonth: 15 },
        startDate: '2025-01-01',
        autoAcknowledge: true,
        isActive: true,
        lastGenerated: '2025-12-15'
    },
    {
        id: 'rec-3',
        name: 'HDFC Life Premium',
        type: 'expense',
        category: 'Insurance',
        amount: 8500,
        recurrence: { type: 'monthly', dayOfMonth: 20 },
        startDate: '2025-01-01',
        autoAcknowledge: false,
        isActive: true,
        lastGenerated: '2025-12-20'
    }
];

export async function getTransactions(): Promise<Transaction[]> {
    return MOCK_TRANSACTIONS;
}

export async function getRecurringTransactions(): Promise<RecurringTransaction[]> {
    return MOCK_RECURRING;
}

export async function addTransaction(t: Transaction): Promise<Transaction> {
    MOCK_TRANSACTIONS.push(t);
    return t;
}
