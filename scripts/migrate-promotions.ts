
import { db } from '@vercel/postgres';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function migrate() {
    console.log('🔌 Connecting to Vercel Postgres (Promotions)...');
    const client = await db.connect();

    try {
        console.log('📄 Reading schema...');
        const schemaPath = path.join(process.cwd(), 'db', 'promotions.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');

        console.log('🚀 Executing migration...');
        await client.query(sql);

        console.log('✅ Migration completed successfully.');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        client.release();
    }
}

migrate();
