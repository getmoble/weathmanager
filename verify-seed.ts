import { db } from './lib/db';
import { transactions, stocks, goals } from './lib/db/schema';
import { count } from 'drizzle-orm';

async function check() {
    const txCount = await db.select({ value: count() }).from(transactions);
    const stockCount = await db.select({ value: count() }).from(stocks);
    const goalCount = await db.select({ value: count() }).from(goals);

    console.log(`Transactions: ${txCount[0].value}`);
    console.log(`Stocks: ${stockCount[0].value}`);
    console.log(`Goals: ${goalCount[0].value}`);
    process.exit(0);
}

check();
