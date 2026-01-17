
import { db } from "../lib/db/index";
import { transactions } from "../lib/db/schema";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";

// Load env vars from project root
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Mapping of Items to Categories and Types
const CATEGORY_MAP: Record<string, { type: 'income' | 'expense' | 'investment'; category: string }> = {
    "Income": { type: 'income', category: 'Salary' },
    "Bonus/Others": { type: 'income', category: 'Bonus' },
    "Recurring Deposit": { type: 'investment', category: 'Recurring Deposit' },
    "SIP Mutual Funds": { type: 'investment', category: 'Mutual Funds' },
    "US Stocks": { type: 'investment', category: 'Stocks' },
    "Crypto": { type: 'investment', category: 'Crypto' },
    "Stocks": { type: 'investment', category: 'Stocks' },
    "LIC": { type: 'investment', category: 'Insurance' },
    "Bonds (Wint Wealth)": { type: 'investment', category: 'Bonds' },
    "NPS": { type: 'investment', category: 'Retirement' },
    "Home Loan": { type: 'expense', category: 'Loan' },
    "Dad LIC": { type: 'expense', category: 'Insurance' },
    "Term Insurance": { type: 'expense', category: 'Insurance' },
    "Medical Insurance": { type: 'expense', category: 'Insurance' },
    "Phone Bill": { type: 'expense', category: 'Utilities' },
    "A 302 Rent + Maintenance": { type: 'expense', category: 'Rent' },
    "11 D Mainteance": { type: 'expense', category: 'Housing' },
    "Internet": { type: 'expense', category: 'Utilities' },
    "Paper": { type: 'expense', category: 'Utilities' },
    "Electricity": { type: 'expense', category: 'Utilities' },
    "Electricity (Home)": { type: 'expense', category: 'Utilities' },
    "Grocery, Eat out": { type: 'expense', category: 'Food' },
    "Medicals & Hospital": { type: 'expense', category: 'Health' },
    "Gas": { type: 'expense', category: 'Utilities' },
    "Water  (Home)": { type: 'expense', category: 'Utilities' },
    "Cash Expenses": { type: 'expense', category: 'Cash' },
    "Donation (Others)": { type: 'expense', category: 'Charity' },
    "Juan Fees": { type: 'expense', category: 'Education' },
    "Juan SIP": { type: 'investment', category: 'Education Fund' },
    "Juan Bus Fees": { type: 'expense', category: 'Transport' },
    "Emma Fees": { type: 'expense', category: 'Education' },
    "Emma SIP": { type: 'investment', category: 'Education Fund' },
    "Emma Bus Fees": { type: 'expense', category: 'Transport' },
    "OTT Subscriptions ": { type: 'expense', category: 'Entertainment' },
    "Tour": { type: 'expense', category: 'Travel' },
    "House Help (Maid) ": { type: 'expense', category: 'Household' },
    "House Help (Cook) ": { type: 'expense', category: 'Household' },
    "Home (Furniture) ": { type: 'expense', category: 'Household' },
    "Fuel (Petrol)": { type: 'expense', category: 'Transport' },
    "Purchases": { type: 'expense', category: 'Shopping' },
    "Travel": { type: 'expense', category: 'Travel' },
    "Jeep Maintenance": { type: 'expense', category: 'Transport' },
    "Jeep Insurance": { type: 'expense', category: 'Insurance' },
    "Slavia Maitenance": { type: 'expense', category: 'Transport' },
    "Slavia Insurance": { type: 'expense', category: 'Insurance' },
    "Car Parking Rent": { type: 'expense', category: 'Transport' },
    "Car Pollution": { type: 'expense', category: 'Transport' },
    "Car Expenses": { type: 'expense', category: 'Transport' },
    "Car Cleaning": { type: 'expense', category: 'Transport' },
    "Scooter Insurance": { type: 'expense', category: 'Insurance' },
    "Personal Grooming": { type: 'expense', category: 'Personal' }
};

interface ParsedTransaction {
    id: string;
    date: string;
    type: 'income' | 'expense' | 'investment';
    category: string;
    amount: number;
    description: string;
    isRecurring: boolean;
    acknowledged: boolean;
    createdAt: string;
}

function parseAmount(val: string): number {
    if (!val) return 0;
    // Remove "Rs", ",", spaces
    const clean = val.toString().replace(/,/g, '').replace(/["']/g, '').trim();
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
}

// Simple CSV parser that handles quoted fields
function parseCSVLine(text: string): string[] {
    const results = [];
    let entry = [];
    let state = 0; // 0: unquoted, 1: quoted

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (state === 0) {
            if (char === ',') {
                results.push(entry.join('').trim());
                entry = [];
            } else if (char === '"') {
                state = 1;
            } else {
                entry.push(char);
            }
        } else {
            if (char === '"') {
                state = 0;
            } else {
                entry.push(char);
            }
        }
    }
    results.push(entry.join('').trim());
    return results;
}

async function main() {
    const csvPath = path.join(process.cwd(), "import_data.csv");
    const fileContent = fs.readFileSync(csvPath, "utf-8");
    const lines = fileContent.split('\n').filter(l => l.trim().length > 0);

    const headers = parseCSVLine(lines[0]);
    // Headers: Items, Sept 2020, Oct 2020, ...


    // Clear existing transactions
    console.log("Clearing existing transactions...");
    await db.delete(transactions);

    const transactionsToInsert: ParsedTransaction[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const cols = parseCSVLine(line);
        const itemName = cols[0];

        // Skip rows that are not in our map or are empty
        if (!itemName || !CATEGORY_MAP[itemName.trim()]) {
            console.log(`Skipping unknown item: ${itemName}`);
            continue;
        }

        const map = CATEGORY_MAP[itemName.trim()];

        // Iterate columns (months)
        for (let j = 1; j < cols.length; j++) {
            const rawAmount = cols[j];
            const amount = parseAmount(rawAmount);

            if (amount > 0) {
                const monthStr = headers[j]; // e.g., "Sept 2020"
                if (!monthStr || monthStr === 'Totals' || monthStr === 'Comments') continue;

                // Fix month string if needed (e.g. Sept -> Sep)
                let cleanMonthStr = monthStr.replace('Sept', 'Sep');

                // Parse date
                const dateStr = `1 ${cleanMonthStr}`;
                const dateObj = new Date(dateStr);

                if (isNaN(dateObj.getTime())) {
                    console.warn(`Invalid date: ${monthStr} (parsed as ${dateStr})`);
                    continue;
                }

                // Adjust timezone offset to avoid previous day issues if treated as UTC
                const isoDate = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), 1)).toISOString();

                if (transactionsToInsert.length < 3) {
                    console.log(`Sample: ${itemName} | ${monthStr} -> ${isoDate} | Amount: ${amount}`);
                }

                transactionsToInsert.push({
                    id: crypto.randomUUID(),
                    date: isoDate,
                    type: map.type,
                    category: map.category,
                    amount: amount,
                    description: `${itemName}`,
                    isRecurring: false, // Could infer from row name if needed
                    acknowledged: true,
                    createdAt: new Date().toISOString()
                });
            }
        }
    }

    console.log(`Found ${transactionsToInsert.length} transactions to insert.`);

    // Batch insert
    if (transactionsToInsert.length > 0) {
        // Clear existing? Maybe not.
        // await db.delete(transactions); 

        // Chunking inserts to avoid query limits
        const chunkSize = 100;
        for (let i = 0; i < transactionsToInsert.length; i += chunkSize) {
            const chunk = transactionsToInsert.slice(i, i + chunkSize);
            await db.insert(transactions).values(chunk);
            console.log(`Inserted chunk ${i / chunkSize + 1}`);
        }
    }

    console.log("Done!");
}

main().catch(console.error);
