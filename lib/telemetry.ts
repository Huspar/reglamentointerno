
import * as fs from "fs";
import * as path from "path";

export type AuditTelemetryEvent = {
    id: string;
    createdAt: string;
    modelVariant: "servicios_10_25" | "construccion_26_50" | "teletrabajo_51_plus" | "unknown";
    issues: Array<{ severity: "info" | "warn" | "error"; code: string }>;
    autofixApplied: boolean;
    fixes: Array<{ code: string; count: number }>;
};

const DATA_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(DATA_DIR, "audit-telemetry.jsonl");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
        console.error("Failed to create data directory for telemetry:", e);
    }
}

export function logAuditEvent(event: AuditTelemetryEvent) {
    try {
        const line = JSON.stringify(event) + "\n";

        // In Vercel/Serverless logic this might be ephemeral, 
        // but for local/VPS usage this works fine.
        // Fallback to console if file write fails (or for Vercel logging)
        if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
            console.log("AUDIT_TELEMETRY:", JSON.stringify(event));
            return;
        }

        fs.appendFileSync(LOG_FILE, line, { encoding: "utf8" });
    } catch (error) {
        console.error("Failed to log audit telemetry:", error);
    }
}

export function getAuditEvents(): AuditTelemetryEvent[] {
    try {
        if (!fs.existsSync(LOG_FILE)) return [];
        const content = fs.readFileSync(LOG_FILE, "utf8");
        return content
            .split("\n")
            .filter(line => line.trim().length > 0)
            .map(line => JSON.parse(line));
    } catch (error) {
        console.error("Failed to read audit telemetry:", error);
        return [];
    }
}
