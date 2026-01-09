import { Transaction, RecurringTransaction } from '@/types/types';
import { DataService } from './dataService';

export async function getTransactions(): Promise<Transaction[]> {
    return DataService.getTransactions();
}

export async function getRecurringTransactions(): Promise<RecurringTransaction[]> {
    return DataService.getRecurringTransactions();
}

export async function addTransaction(t: Transaction): Promise<Transaction> {
    return DataService.addTransaction(t);
}

