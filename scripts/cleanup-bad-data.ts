
import { db } from "../lib/db/index";
import { transactions } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import path from "path";
import dotenv from "dotenv";

// Load env vars from project root
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
    console.log("Starting data cleanup...");

    // Delete transactions with description "Term Insurance Axis"
    const result = await db.delete(transactions)
        .where(eq(transactions.description, "Term Insurance Axis"));

    console.log(`Successfully deleted incorrect entries.`);
    console.log("Cleanup done!");
}

main().catch(console.error);
