
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { auditEvents, builderPromotions } from "@/lib/db/schema";

export async function GET(request: Request) {
    // Security check
    const authHeader = request.headers.get("x-admin-token");
    if (!process.env.ADMIN_TOKEN || authHeader !== process.env.ADMIN_TOKEN) {
        if (process.env.NODE_ENV === "production") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        // We use raw SQL via Drizzle for complex analytics that are hard to express in query builder
        // but we benefit from the shared client connection.

        // 1. KPI Queries
        const kpiRes = await db.execute(sql`
            SELECT
                COUNT(*) as total_events,
                SUM(CASE WHEN autofix_applied THEN 1 ELSE 0 END) as docs_with_autofix,
                SUM(CASE WHEN has_error THEN 1 ELSE 0 END) as docs_with_error
            FROM ${auditEvents}
            WHERE created_at > NOW() - INTERVAL '30 days'
        `);

        // 2. Fix Metrics
        const fixMetricsRes = await db.execute(sql`
            SELECT COALESCE(SUM( (fix->>'count')::int ), 0) AS total_fixes_applied
            FROM ${auditEvents},
            LATERAL jsonb_array_elements(fixes) fix
            WHERE created_at > NOW() - INTERVAL '30 days'
        `);

        // 3. Top Issues
        const topIssuesRes = await db.execute(sql`
            SELECT 
                issue->>'code' as code, 
                COUNT(*) as count
            FROM ${auditEvents}, jsonb_array_elements(issues) issue
            WHERE created_at > NOW() - INTERVAL '30 days'
            GROUP BY code 
            ORDER BY count DESC 
            LIMIT 10
        `);

        // 4. Top Fixes by Volume
        const topFixesParams = await db.execute(sql`
            SELECT 
                fix->>'code' as code, 
                SUM((fix->>'count')::int) as totalCount
            FROM ${auditEvents}, LATERAL jsonb_array_elements(fixes) fix
            WHERE created_at > NOW() - INTERVAL '30 days'
            GROUP BY code 
            ORDER BY totalCount DESC
            LIMIT 10
        `);

        // 5. Top Fixes by Presence
        const topFixesPresenceRes = await db.execute(sql`
            SELECT
                fix->>'code' as code,
                COUNT(DISTINCT audit_events.id) as docsWithFix
            FROM ${auditEvents}, LATERAL jsonb_array_elements(fixes) fix
            WHERE created_at > NOW() - INTERVAL '30 days'
            GROUP BY code
            ORDER BY docsWithFix DESC
            LIMIT 10
        `);

        // 6. Recent Events
        const lastEventsRes = await db.select().from(auditEvents).orderBy(sql`${auditEvents.created_at} DESC`).limit(20);

        // Process Data (Type casting from raw SQL results)
        const row0 = kpiRes.rows[0] as any;
        const totalEvents = parseInt(row0.total_events || '0');
        const docsWithAutofix = parseInt(row0.docs_with_autofix || '0');
        const docsWithError = parseInt(row0.docs_with_error || '0');

        const fixRow0 = fixMetricsRes.rows[0] as any;
        const totalFixesApplied = parseInt(fixRow0.total_fixes_applied || '0');

        const autofixRateDocs = totalEvents > 0 ? (docsWithAutofix / totalEvents) * 100 : 0;
        const errorRateDocs = totalEvents > 0 ? (docsWithError / totalEvents) * 100 : 0;
        const avgFixesPerDoc = totalEvents > 0 ? (totalFixesApplied / totalEvents) : 0;

        const topIssues = topIssuesRes.rows.map((row: any) => ({
            code: row.code,
            count: parseInt(row.count)
        }));

        const topFixesByCount = topFixesParams.rows.map((row: any) => ({
            code: row.code,
            totalCount: parseInt(row.totalcount)
        }));

        const topFixesByPresence = topFixesPresenceRes.rows.map((row: any) => ({
            code: row.code,
            docsWithFix: parseInt(row.docswithfix),
            presenceRate: totalEvents > 0 ? (parseInt(row.docswithfix) / totalEvents) * 100 : 0
        }));

        // 7. Promotion Logic (Simplified for Drizzle)
        const totalDocs30 = totalEvents;
        if (totalDocs30 >= 5) {
            const candidatesRes = await db.execute(sql`
                SELECT
                    fix->>'code' as code,
                    COUNT(DISTINCT audit_events.id) as docsWithFix
                FROM ${auditEvents}, LATERAL jsonb_array_elements(fixes) fix
                WHERE created_at > NOW() - INTERVAL '30 days'
                GROUP BY code
            `);

            for (const row of candidatesRes.rows as any[]) {
                const count = parseInt(row.docswithfix);
                const rate = (count / totalDocs30) * 100;

                if (rate >= 80) {
                    await db.execute(sql`
                        INSERT INTO ${builderPromotions} (fix_code, presence_rate, promoted, promoted_at)
                        VALUES (${row.code}, ${rate}, true, NOW())
                        ON CONFLICT (fix_code) DO NOTHING
                    `);
                }
            }
        }

        // 8. Promotions
        // Map Drizzle result to expected shape
        const promotionsRes = await db.select()
            .from(builderPromotions)
            .where(sql`${builderPromotions.promoted} = true`)
            .orderBy(sql`${builderPromotions.promoted_at} DESC`);

        const promotions = promotionsRes.map(r => ({
            id: r.id,
            code: r.fix_code,
            rate: r.presence_rate,
            at: r.promoted_at
        }));

        return NextResponse.json({
            kpis: {
                totalEvents,
                docsWithAutofix,
                docsWithError,
                autofixRateDocs: autofixRateDocs.toFixed(1),
                errorRateDocs: errorRateDocs.toFixed(1),
                totalFixesApplied,
                avgFixesPerDoc: avgFixesPerDoc.toFixed(2)
            },
            topIssues,
            topFixes: {
                byCount: topFixesByCount,
                byDocPresence: topFixesByPresence
            },
            recentEvents: lastEventsRes,
            promotions: promotionsRes
        });

    } catch (e) {
        console.error("Metrics DB Error:", e);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
