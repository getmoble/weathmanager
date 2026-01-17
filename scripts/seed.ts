import { db } from '../lib/db';
import { transactions, recurringTransactions, stocks, goals, assets, banks, brokers, categories } from '../lib/db/schema';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seed() {
    console.log('Seeding database...');
    const dataDir = path.join(process.cwd(), 'public', 'data');
    const read = (file: string) => JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));

    try {
        const txData = read('transactions.json');
        const recurringData = read('recurring.json');
        const stocksData = read('stocks.json');
        const goalsData = read('goals.json'); // goals.json matches schema mostly
        // Ensure goals data matches fields. json has 'inflationRate', 'expectedReturn' which are in types.ts but I missed in schema.
        // Retrying schema update is expensive, I will ignore extra fields or assume strict schema will just drop them?
        // Drizzle insert ignores undefined fields but if I pass extra fields it might warn or error depending on driver.
        // Let's rely on flexible insertion or minimal mapping.

        const assetsData = read('assets.json');
        const banksData = read('banks.json');
        const brokersData = read('brokers.json');
        const categoriesData = read('categories.json');

        console.log('Clearing tables...');
        await db.delete(transactions);
        await db.delete(recurringTransactions);
        await db.delete(stocks);
        await db.delete(goals);
        await db.delete(assets);
        await db.delete(banks);
        await db.delete(brokers);
        await db.delete(categories);

        console.log('Inserting transactions...');
        if (txData.length) await db.insert(transactions).values(txData);

        console.log('Inserting recurring transactions...');
        if (recurringData.length) await db.insert(recurringTransactions).values(recurringData);

        console.log('Inserting stocks...');
        if (stocksData.length) await db.insert(stocks).values(stocksData);

        console.log('Inserting goals...');
        // goals table in schema: id, name, description, currentAmount, targetAmount, targetYear, status, monthlyContribution
        // goals.json has: inflationRate, category, expectedReturn. 
        // I should probably map goals to avoid errors if strict.
        const mappedGoals = goalsData.map((g: any) => ({
            id: g.id,
            name: g.name,
            description: g.description,
            currentAmount: g.currentAmount,
            targetAmount: g.targetAmount,
            targetYear: g.targetYear,
            status: g.status,
            monthlyContribution: g.monthlyContribution
        }));
        if (mappedGoals.length) await db.insert(goals).values(mappedGoals);

        console.log('Inserting assets...');
        if (assetsData.length) await db.insert(assets).values(assetsData);

        console.log('Inserting banks...');
        if (banksData.length) await db.insert(banks).values(banksData);

        console.log('Inserting brokers...');
        if (brokersData.length) await db.insert(brokers).values(brokersData);

        console.log('Inserting categories...');
        const catRows: any[] = [];
        (categoriesData.income || []).forEach((c: string) => catRows.push({ name: c, type: 'income' }));
        (categoriesData.expense || []).forEach((c: string) => catRows.push({ name: c, type: 'expense' }));
        (categoriesData.assets || []).forEach((c: string) => catRows.push({ name: c, type: 'asset' }));

        if (catRows.length) await db.insert(categories).values(catRows);

        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
