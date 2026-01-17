
import { db } from './lib/db';
import { transactions } from './lib/db/schema';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
    const res = await db.select({
        amount: transactions.amount,
        count: sql<number>`count(*)`,
        minDate: sql<string>`min(date)`,
        maxDate: sql<string>`max(date)`
    })
        .from(transactions)
        .where(sql`category ILIKE 'salary'`)
        .groupBy(transactions.amount);

    console.log(JSON.stringify(res, null, 2));
}

run().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
