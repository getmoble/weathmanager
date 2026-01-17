
import { db } from './lib/db';
import { transactions } from './lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function analyze() {
    console.log("Analyzing Income Data...");

    const incomeTxs = await db.select()
        .from(transactions)
        .where(eq(transactions.type, 'income'))
        .orderBy(desc(transactions.date));

    const totalIncome = incomeTxs.reduce((sum, t) => sum + t.amount, 0);

    const salaryTxs = incomeTxs.filter(t => t.category.toLowerCase() === 'salary');
    const bonusTxs = incomeTxs.filter(t => t.category.toLowerCase() === 'bonus');
    const others = incomeTxs.filter(t => !['salary', 'bonus'].includes(t.category.toLowerCase()));

    const salaryTotal = salaryTxs.reduce((sum, t) => sum + t.amount, 0);
    const bonusTotal = bonusTxs.reduce((sum, t) => sum + t.amount, 0);

    console.log(`Total Income: ₹${totalIncome.toLocaleString('en-IN')}`);
    console.log(`Salary: ₹${salaryTotal.toLocaleString('en-IN')} (${salaryTxs.length} entries)`);
    console.log(`Bonus: ₹${bonusTotal.toLocaleString('en-IN')} (${bonusTxs.length} entries)`);
    console.log(`Others: (${others.length} entries)`);

    if (incomeTxs.length > 0) {
        const lastDate = new Date(incomeTxs[0].date);
        const firstDate = new Date(incomeTxs[incomeTxs.length - 1].date);

        console.log(`First Income: ${firstDate.toISOString().split('T')[0]}`);
        console.log(`Last Income: ${lastDate.toISOString().split('T')[0]}`);

        const monthsDiff = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 + (lastDate.getMonth() - firstDate.getMonth()) + 1;
        console.log(`Total Months in Range: ${monthsDiff}`);

        const uniqueMonths = new Set(incomeTxs.map(t => {
            const d = new Date(t.date);
            return `${d.getFullYear()}-${d.getMonth() + 1}`;
        }));

        console.log(`Unique Months with Income: ${uniqueMonths.size}`);
        console.log(`Avg Monthly (using unique months): ₹${(totalIncome / uniqueMonths.size).toLocaleString('en-IN')}`);
        console.log(`Avg Monthly (using full range): ₹${(totalIncome / monthsDiff).toLocaleString('en-IN')}`);

        if (salaryTxs.length > 0) {
            console.log(`Avg Salary per Salary Entry: ₹${(salaryTotal / salaryTxs.length).toLocaleString('en-IN')}`);
        }
    }
}

analyze().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
