import { Transaction, RecurringTransaction, Stock, Goal, Asset } from '@/types/types';
import { getTransactions, getRecurringTransactions, getStocks, getGoals, getAssets, getBanks, getBrokers, getCategories as getCategoriesAction } from './actions';

/**
 * DataService now bridges the Frontend to Server Actions (Database).
 */

export const DataService = {
    getTransactions: async (): Promise<Transaction[]> => {
        const data = await getTransactions();
        return data as unknown as Transaction[];
    },

    getRecurringTransactions: async (): Promise<RecurringTransaction[]> => {
        const data = await getRecurringTransactions();
        return data as unknown as RecurringTransaction[];
    },

    getStocks: async (): Promise<Stock[]> => {
        const data = await getStocks();
        return data as unknown as Stock[];
    },

    getBanks: async (): Promise<any[]> => {
        return await getBanks();
    },

    getBrokers: async (): Promise<any[]> => {
        return await getBrokers();
    },

    getCategories: async (): Promise<{ income: string[], expense: string[], assets: string[] }> => {
        return await getCategoriesAction();
    },

    deleteCategory: async (name: string, type: string) => {
        const { deleteCategory } = await import('./actions'); // Dynamic import to avoid circular dep if any (unlikely here but safe)
        return await deleteCategory(name, type);
    },

    getGoals: async (): Promise<Goal[]> => {
        const data = await getGoals();
        return data as unknown as Goal[];
    },

    getAssets: async (): Promise<Asset[]> => {
        const data = await getAssets();
        return data as unknown as Asset[];
    },

    // TODO: Implement actual mutations
    addTransaction: async (transaction: Omit<Transaction, 'id'>) => {
        console.log("Add transaction not implemented in DB yet", transaction);
        return { ...transaction, id: 'temp' } as Transaction;
    }
};
