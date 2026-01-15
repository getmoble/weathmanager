'use server'

import { db } from './db';
import { transactions, recurringTransactions, stocks, goals, assets, banks, brokers, categories } from './db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Transactions
export async function getTransactions() {
    return await db.select().from(transactions).orderBy(desc(transactions.date));
}

export async function createTransaction(data: any) {
    const newId = crypto.randomUUID();
    await db.insert(transactions).values({ ...data, id: newId });
    revalidatePath('/dashboard/expenses');
    revalidatePath('/dashboard/expenses/list');
    return { success: true, id: newId };
}

export async function updateTransaction(id: string, data: any) {
    // Remove undefined fields to avoid overwriting with null/undefined if partial update
    const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
    );
    await db.update(transactions).set(updateData).where(eq(transactions.id, id));
    revalidatePath('/dashboard/expenses');
    revalidatePath('/dashboard/expenses/list');
    return { success: true };
}

export async function deleteTransaction(id: string) {
    await db.delete(transactions).where(eq(transactions.id, id));
    revalidatePath('/dashboard/expenses');
    revalidatePath('/dashboard/expenses/list');
    return { success: true };
}

// Recurring
export async function getRecurringTransactions() {
    return await db.select().from(recurringTransactions);
}

// Stocks
export async function getStocks() {
    return await db.select().from(stocks);
}

// Goals
export async function getGoals() {
    return await db.select().from(goals);
}

export async function createGoal(data: any) {
    const newId = crypto.randomUUID();
    await db.insert(goals).values({ ...data, id: newId });
    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/goals');
    return { success: true };
}

export async function updateGoal(id: string, data: any) {
    await db.update(goals).set(data).where(eq(goals.id, id));
    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/goals');
    return { success: true };
}

export async function deleteGoal(id: string) {
    await db.delete(goals).where(eq(goals.id, id));
    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/goals');
    return { success: true };
}

// Assets
export async function getAssets() {
    return await db.select().from(assets);
}

export async function createAsset(data: any) {
    const newId = crypto.randomUUID();
    await db.insert(assets).values({ ...data, id: newId });
    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/assets');
    return { success: true };
}

export async function updateAsset(id: string, data: any) {
    await db.update(assets).set(data).where(eq(assets.id, id));
    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/assets');
    return { success: true };
}

export async function deleteAsset(id: string) {
    await db.delete(assets).where(eq(assets.id, id));
    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/assets');
    return { success: true };
}

// Banks
export async function getBanks() {
    return await db.select().from(banks);
}

export async function createBank(data: any) {
    // id is serial, so we don't pass it
    await db.insert(banks).values(data);
    revalidatePath('/dashboard/settings');
    return { success: true };
}

export async function updateBank(id: number, data: any) {
    await db.update(banks).set(data).where(eq(banks.id, id));
    revalidatePath('/dashboard/settings');
    return { success: true };
}

export async function deleteBank(id: number) {
    await db.delete(banks).where(eq(banks.id, id));
    revalidatePath('/dashboard/settings');
    return { success: true };
}

// Brokers
export async function getBrokers() {
    return await db.select().from(brokers);
}

export async function createBroker(data: any) {
    await db.insert(brokers).values(data);
    revalidatePath('/dashboard/settings');
    return { success: true };
}

export async function updateBroker(id: number, data: any) {
    await db.update(brokers).set(data).where(eq(brokers.id, id));
    revalidatePath('/dashboard/settings');
    return { success: true };
}

export async function deleteBroker(id: number) {
    await db.delete(brokers).where(eq(brokers.id, id));
    revalidatePath('/dashboard/settings');
    return { success: true };
}

// Categories
export async function getCategories() {
    const allParams = await db.select().from(categories);
    return {
        income: allParams.filter(c => c.type === 'income').map(c => c.name),
        expense: allParams.filter(c => c.type === 'expense').map(c => c.name),
        assets: allParams.filter(c => c.type === 'asset').map(c => c.name),
        // Return full objects if needed for deletion, or we can find by name + type
        all: allParams
    };
}

export async function createCategory(name: string, type: string) {
    await db.insert(categories).values({ name, type });
    revalidatePath('/dashboard/settings');
    return { success: true };
}

export async function deleteCategory(name: string, type: string) {
    // Deleting by name + type combo
    // In a real app we'd prefer ID, but existing UI uses strings. 
    // We can fetch ID first or delete using AND condition if Drizzle supports it easily with AND helper
    // or raw sql. Drizzle has `and`.
    const { and } = await import('drizzle-orm');
    await db.delete(categories).where(and(eq(categories.name, name), eq(categories.type, type)));
    revalidatePath('/dashboard/settings');
    return { success: true };
}
