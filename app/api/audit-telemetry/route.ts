
import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
    // Security check
    const authHeader = request.headers.get("x-admin-token");
    if (!process.env.ADMIN_TOKEN || authHeader !== process.env.ADMIN_TOKEN) {
        if (process.env.NODE_ENV === "production") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        // A) KPIs
        const totalEventsPromise = sql`SELECT COUNT(*) as count FROM audit_events`;
        const autofixEventsPromise = sql`SELECT COUNT(*) as count FROM audit_events WHERE autofix_applied = true`;

        // B) Top Issues (Last 30 days) - Using Postgres JSON functions
        // "issues" is a JSONB array of objects { severity, code }
        const topIssuesPromise = sql`
            SELECT 
                issue->>'code' as code, 
                COUNT(*) as count
            FROM audit_events, jsonb_array_elements(issues) issue
            WHERE created_at > NOW() - INTERVAL '30 days'
            GROUP BY code 
            ORDER BY count DESC 
            LIMIT 5
        `;

        // C) Top Fixes
        const topFixesPromise = sql`
            SELECT 
                fix->>'code' as code, 
                COUNT(*) as count
            FROM audit_events, jsonb_array_elements(fixes) fix
            WHERE created_at > NOW() - INTERVAL '30 days'
            GROUP BY code 
            ORDER BY count DESC 
            LIMIT 5
        `;

        // D) Last Events
        const lastEventsPromise = sql`
            SELECT id, created_at, model_variant, autofix_applied, has_error, error_count, warn_count, issues
            FROM audit_events 
            ORDER BY created_at DESC 
            LIMIT 20
        `;

        const [totalRes, autofixRes, topIssuesRes, topFixesRes, lastEventsRes] = await Promise.all([
            totalEventsPromise,
            autofixEventsPromise,
            topIssuesPromise,
            topFixesPromise,
            lastEventsPromise
        ]);

        const totalEvents = parseInt(totalRes.rows[0].count);
        const eventsWithAutofix = parseInt(autofixRes.rows[0].count);
        const autofixRate = totalEvents > 0 ? (eventsWithAutofix / totalEvents) * 100 : 0;

        const topIssues = topIssuesRes.rows.map(row => ({
            code: row.code,
            count: parseInt(row.count),
            percentage: totalEvents > 0 ? (parseInt(row.count) / totalEvents) * 100 : 0
        }));

        const topFixes = topFixesRes.rows.map(row => ({
            code: row.code,
            count: parseInt(row.count),
            percentage: totalEvents > 0 ? (parseInt(row.count) / totalEvents) * 100 : 0
        }));

        // Format last events
        const lastEvents = lastEventsRes.rows.map(row => ({
            id: row.id,
            createdAt: row.created_at,
            modelVariant: row.model_variant,
            autofixApplied: row.autofix_applied,
            issues: row.issues,
            hasError: row.has_error
        }));

        return NextResponse.json({
            stats: {
                totalEvents,
                autofixRate: autofixRate.toFixed(1),
                eventsWithAutofix
            },
            topIssues,
            topFixes,
            lastEvents
        });

    } catch (e) {
        console.error("Metrics DB Error:", e);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
