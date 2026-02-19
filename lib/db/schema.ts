
import { pgTable, serial, bigserial, text, timestamp, boolean, jsonb, integer, doublePrecision } from 'drizzle-orm/pg-core';

export const auditEvents = pgTable('audit_events', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    model_variant: text('model_variant').notNull(),
    issues: jsonb('issues').notNull(),
    fixes: jsonb('fixes').notNull(),
    autofix_applied: boolean('autofix_applied').default(false).notNull(),
    has_error: boolean('has_error').default(false).notNull(),
    error_count: integer('error_count').default(0).notNull(),
    warn_count: integer('warn_count').default(0).notNull(),
});

export const builderPromotions = pgTable('builder_promotions', {
    id: serial('id').primaryKey(),
    fix_code: text('fix_code').notNull().unique(),
    presence_rate: doublePrecision('presence_rate').notNull(),
    window_days: integer('window_days').default(30),
    promoted: boolean('promoted').default(true),
    promoted_at: timestamp('promoted_at', { withTimezone: true }).defaultNow(),
});

export const rateLimits = pgTable('rate_limits', {
    ip: text('ip').primaryKey(),
    count: integer('count').notNull().default(0),
    reset_at: timestamp('reset_at', { withTimezone: true }).notNull(),
});
