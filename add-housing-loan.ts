import { db } from './lib/db/index';
import { liabilities } from './lib/db/schema';

async function addHousingLoan() {
    console.log('Adding Housing Loan...');

    const loan = {
        id: crypto.randomUUID(),
        name: 'Housing Loan',
        type: 'Home Loan',
        totalAmount: 3650000,
        outstandingAmount: 3650000,
        interestRate: 7.25,
        monthlyPayment: 30000,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2055-01-18', // 29 years from now
        notes: 'User requested addition: 36.5 Lakhs at 7.25% for 29 years, 30k EMI'
    };

    await db.insert(liabilities).values(loan as any);

    console.log('Housing Loan added successfully!');
    process.exit(0);
}

addHousingLoan().catch(err => {
    console.error('Failed to add Housing Loan:', err);
    process.exit(1);
});
