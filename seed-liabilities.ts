import { db } from './lib/db/index';
import { liabilities } from './lib/db/schema';

async function seedLiabilities() {
    console.log('Seeding liabilities...');

    const sampleLiabilities = [
        {
            id: crypto.randomUUID(),
            name: 'HDFC Home Loan',
            type: 'Home Loan',
            totalAmount: 7500000,
            outstandingAmount: 6850000,
            interestRate: 8.5,
            startDate: '2023-01-15',
            endDate: '2043-01-15',
            notes: 'Main residence loan'
        },
        {
            id: crypto.randomUUID(),
            name: 'ICICI Personal Loan',
            type: 'Personal Loan',
            totalAmount: 500000,
            outstandingAmount: 320000,
            interestRate: 11.5,
            startDate: '2024-06-10',
            endDate: '2027-06-10',
            notes: 'Education expenses'
        },
        {
            id: crypto.randomUUID(),
            name: 'SBI Cashback Credit Card',
            type: 'Credit Card',
            totalAmount: 100000,
            outstandingAmount: 45000,
            interestRate: 42.0,
            startDate: '2025-12-01',
            notes: 'Monthly billing'
        }
    ];

    for (const liability of sampleLiabilities) {
        await db.insert(liabilities).values(liability);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
}

seedLiabilities().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
