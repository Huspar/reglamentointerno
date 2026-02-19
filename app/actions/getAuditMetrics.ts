'use server';

import { sql } from '@vercel/postgres';

export async function getAuditMetrics() {
    try {
        // 1. KPIs
        const kpisRes = await sql`
      SELECT 
        COUNT(*) as totalEvents,
        COUNT(*) FILTER (WHERE autofix_applied = true) as docsWithAutofix,
        COUNT(*) FILTER (WHERE has_error = true) as docsWithError,
        SUM(jsonb_array_length(fixes)) as totalFixesApplied
      FROM audit_events
      WHERE created_at > NOW() - INTERVAL '30 days'
    `;
        const kpis = kpisRes.rows[0];
        const totalEvents = parseInt(kpis.totalevents || '0');
        const docsWithAutofix = parseInt(kpis.docswithautofix || '0');
        const docsWithError = parseInt(kpis.docswitherror || '0');
        const totalFixesApplied = parseInt(kpis.totalfixesapplied || '0');

        // 2. Top Issues (Blockers)
        const topIssuesRes = await sql`
      SELECT 
        issue->>'code' as code,
        COUNT(*) as count
      FROM audit_events, LATERAL jsonb_array_elements(issues) issue
      WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY code
      ORDER BY count DESC
      LIMIT 5
    `;

        // 3. Top Fixes (Applied)
        // 3a. By Volume (Total count of fixes applied)
        const topFixesCountRes = await sql`
        SELECT 
            fix->>'code' as code,
            COUNT(*) as totalCount
        FROM audit_events, LATERAL jsonb_array_elements(fixes) fix
        WHERE created_at > NOW() - INTERVAL '30 days'
        GROUP BY code
        ORDER BY totalCount DESC
        LIMIT 5
    `;

        // 3b. By Document Presence (How many docs had this fix applied)
        // We count DISTINCT(audit_events.id) to know in how many docs it appeared
        const topFixesPresenceRes = await sql`
        SELECT 
            fix->>'code' as code,
            COUNT(DISTINCT audit_events.id) as docsWithFix
        FROM audit_events, LATERAL jsonb_array_elements(fixes) fix
        WHERE created_at > NOW() - INTERVAL '30 days'
        GROUP BY code
        ORDER BY docsWithFix DESC
        LIMIT 5
    `;

        // 4. Recent Events
        const recentRes = await sql`
      SELECT 
        id, 
        created_at as "createdAt", 
        model_variant as "modelVariant", 
        autofix_applied as "autofixApplied", 
        issues, 
        has_error as "hasError"
      FROM audit_events
      ORDER BY created_at DESC
      LIMIT 20
    `;

        // 5. Active Promotions
        const promotionsRes = await sql`
        SELECT * FROM builder_promotions WHERE promoted = true ORDER BY promoted_at DESC
    `;
        const promotions = promotionsRes.rows.map(r => ({
            id: r.id,
            code: r.fix_code,
            rate: r.presence_rate,
            at: r.promoted_at
        }));

        // Calculate derived rates
        const autofixRateDocs = totalEvents > 0 ? ((docsWithAutofix / totalEvents) * 100).toFixed(1) : '0.0';
        const errorRateDocs = totalEvents > 0 ? ((docsWithError / totalEvents) * 100).toFixed(1) : '0.0';
        const avgFixesPerDoc = totalEvents > 0 ? (totalFixesApplied / totalEvents).toFixed(2) : '0.0';

        // Format Top Fixes by Presence with Rate
        const byDocPresence = topFixesPresenceRes.rows.map(row => ({
            code: row.code,
            docsWithFix: parseInt(row.docswithfix),
            presenceRate: totalEvents > 0 ? (parseInt(row.docswithfix) / totalEvents) * 100 : 0
        }));

        return {
            kpis: {
                totalEvents,
                docsWithAutofix,
                docsWithError,
                autofixRateDocs,
                errorRateDocs,
                totalFixesApplied,
                avgFixesPerDoc
            },
            topIssues: topIssuesRes.rows,
            topFixes: {
                byCount: topFixesCountRes.rows.map(r => ({ code: r.code, totalCount: parseInt(r.totalcount) })),
                byDocPresence: byDocPresence
            },
            recentEvents: recentRes.rows,
            promotions
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch audit metrics.');
    }
}
