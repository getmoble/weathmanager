import { db } from './lib/db';
import { assets } from './lib/db/schema';
import { eq } from 'drizzle-orm';

async function checkAssets() {
    const result = await db.select().from(assets);
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
}

checkAssets();
