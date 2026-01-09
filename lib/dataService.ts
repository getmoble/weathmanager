import { Transaction, RecurringTransaction, Stock, Goal, Asset } from '@/types/types';

/**
 * DataService simulates an API layer by fetching local JSON files.
 * This architecture allows for easy replacement with a real backend later.
 */

async function fetchFromApi<T>(path: string): Promise<T> {
    const response = await fetch(`/data/${path}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${path}`);
    }
    return response.json();
}

export const DataService = {
    getTransactions: () => fetchFromApi<Transaction[]>('transactions.json'),

    getRecurringTransactions: () => fetchFromApi<RecurringTransaction[]>('recurring.json'),

    getStocks: () => fetchFromApi<Stock[]>('stocks.json'),

    getBanks: () => fetchFromApi<any[]>('banks.json'),

    getBrokers: () => fetchFromApi<any[]>('brokers.json'),

    getCategories: () => fetchFromApi<{ income: string[], expense: string[] }>('categories.json'),

    getGoals: () => fetchFromApi<Goal[]>('goals.json'),
    getAssets: () => fetchFromApi<Asset[]>('assets.json'),

    // Simulated POST methods (logic for local state would normally be more complex)
    addTransaction: async (transaction: Omit<Transaction, 'id'>) => {
        console.log("Simulating API POST to /transactions", transaction);
        // In a real scenario, you'd generate an ID and return the full Transaction
        return { ...transaction, id: Math.random().toString(36).substring(2, 9) } as Transaction;
    }
};
