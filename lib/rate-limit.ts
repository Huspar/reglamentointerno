
import { db } from "@/lib/db";
import { rateLimits } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

const MAX_REQUESTS = 10;
const WINDOW_HOURS = 1;

export async function checkRateLimit(ip: string): Promise<boolean> {
    try {
        // 1. Get current limit
        const result = await db.select().from(rateLimits).where(eq(rateLimits.ip, ip));
        const limit = result[0];
        const now = new Date();

        if (!limit) {
            // 2. Create if not exists
            const resetAt = new Date(now.getTime() + WINDOW_HOURS * 60 * 60 * 1000);
            await db.insert(rateLimits).values({
                ip,
                count: 1,
                reset_at: resetAt
            });
            return true;
        }

        if (now > limit.reset_at) {
            // 3. Reset window
            const resetAt = new Date(now.getTime() + WINDOW_HOURS * 60 * 60 * 1000);
            await db.update(rateLimits)
                .set({ count: 1, reset_at: resetAt })
                .where(eq(rateLimits.ip, ip));
            return true;
        }

        if (limit.count >= MAX_REQUESTS) {
            return false; // Rate limited
        }

        // 4. Increment
        await db.update(rateLimits)
            .set({ count: sql`${rateLimits.count} + 1` })
            .where(eq(rateLimits.ip, ip));

        return true;

    } catch (error) {
        console.error("Rate limit error:", error);
        // Fail open if DB error
        return true;
    }
}
