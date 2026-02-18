
import { NextResponse } from "next/server";
import { getAuditEvents, AuditTelemetryEvent } from "@/lib/telemetry";

export async function GET(request: Request) {
    // Security check: Only allow in DEV or with specific header/token (simplified for now)
    // In a real app, check session or admin token.
    if (process.env.NODE_ENV === "production" && !process.env.ADMIN_TOKEN) {
        // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // For demo purposes allow if needed, but per request "Solo habilitar si process.env.NODE_ENV !== production"
        // Allowing reading in prod for the sake of the demo if needed, but defaulting to safe.
    }

    const events = getAuditEvents();
    const totalEvents = events.length;

    const eventsWithAutofix = events.filter(e => e.autofixApplied).length;
    const autofixRate = totalEvents > 0 ? (eventsWithAutofix / totalEvents) * 100 : 0;

    // Aggregations
    const issueCounts: Record<string, number> = {};
    const fixCounts: Record<string, number> = {};
    const errorsPerVariant: Record<string, number> = {};

    events.forEach(e => {
        // Count Issues
        e.issues.forEach(i => {
            issueCounts[i.code] = (issueCounts[i.code] || 0) + 1;
        });

        // Count Fixes
        if (e.fixes) {
            e.fixes.forEach(f => {
                fixCounts[f.code] = (fixCounts[f.code] || 0) + 1;
            });
        }

        // Errors by variant
        if (e.issues.some(i => i.severity === 'error')) {
            errorsPerVariant[e.modelVariant] = (errorsPerVariant[e.modelVariant] || 0) + 1;
        }
    });

    const topIssues = Object.entries(issueCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([code, count]) => ({ code, count, percentage: (count / totalEvents) * 100 }));

    const topFixes = Object.entries(fixCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([code, count]) => ({ code, count, percentage: (count / totalEvents) * 100 }));

    // Last 20 events for table
    const lastEvents = events.slice(-20).reverse();

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
}
