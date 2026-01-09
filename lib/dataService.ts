import { Transaction, RecurringTransaction, Stock } from '@/types/types';

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

    // Simulated POST methods (logic for local state would normally be more complex)
    addTransaction: async (tx: Transaction): Promise<Transaction> => {
        console.log("Simulating API POST to /transactions", tx);
        return tx;
    }
};
