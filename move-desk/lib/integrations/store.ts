// ─────────────────────────────────────────────────────────────
// Lead store — the operational record of every lead.
//
// Two adapters, selected by LEAD_STORE:
//   "memory" (default) — demo mode. Per-process only; a restart
//     loses leads. Never claim production persistence in this mode.
//   "file" — production-capable on any host with a persistent disk
//     (VPS, Fly volume, Docker volume). One JSON file per lead under
//     LEAD_STORE_DIR (default .data/leads). Survives restarts —
//     verified by scripts/verify.mjs's restart-survival check.
//
// On serverless hosts (Vercel/Lambda) local disk is ephemeral: run
// "file" mode only with a mounted volume, or treat the CRM webhook
// as the system of record and keep LEAD_STORE=memory. DEPLOYMENT.md
// spells out which to use where.
//
// The stored record is the full operational lead record: identity,
// timestamps, intent, consent, attribution, Auto-Brief, delivery
// history, and its own persistence status. Internal only — nothing
// here is ever returned to a consumer response.
// ─────────────────────────────────────────────────────────────

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Lead } from "@/lib/leads";
import type { AutoBrief } from "@/lib/autobrief";
import type { DeliveryResult } from "./index";

export type PersistenceMode = "memory" | "file";

export interface PersistenceStatus {
  mode: PersistenceMode;
  /** True only when the record is on durable storage. */
  persisted: boolean;
  detail?: string;
}

export interface StoredLead {
  id: string;
  createdAt: string;      // lead timestamp
  type: "buyer" | "seller";
  consentAt: string;
  lead: Lead;
  brief: AutoBrief;
  delivery: DeliveryResult[];
  persistence: PersistenceStatus;
}

function storeMode(): PersistenceMode {
  return process.env.LEAD_STORE === "file" ? "file" : "memory";
}

function storeDir(): string {
  return process.env.LEAD_STORE_DIR || path.join(process.cwd(), ".data", "leads");
}

// Memory adapter — always maintained as a fast cache; the only copy
// in "memory" mode.
const memory: StoredLead[] = [];

function fileName(record: StoredLead): string {
  // Timestamp prefix keeps directory listings chronologically sortable.
  const ts = record.createdAt.replace(/[:.]/g, "-");
  return `${ts}-${record.id}.json`;
}

export async function saveLead(lead: Lead, brief: AutoBrief): Promise<StoredLead> {
  const mode = storeMode();
  const record: StoredLead = {
    id: lead.id,
    createdAt: lead.createdAt,
    type: lead.type,
    consentAt: lead.createdAt,
    lead,
    brief,
    delivery: [],
    persistence: { mode, persisted: false, detail: mode === "memory" ? "in-memory (demo) — set LEAD_STORE=file" : undefined },
  };

  memory.push(record);

  if (mode === "file") {
    try {
      const dir = storeDir();
      await fs.mkdir(dir, { recursive: true });
      // Mark durable BEFORE serializing so the on-disk record carries
      // its true status; reverted below if the write actually fails.
      record.persistence = { mode, persisted: true };
      await fs.writeFile(path.join(dir, fileName(record)), JSON.stringify(record, null, 2), "utf8");
    } catch (e) {
      // Never lose the lead: memory copy stands, failure is visible
      // internally (console + server log), the visitor is unaffected.
      record.persistence = { mode, persisted: false, detail: e instanceof Error ? e.message : "file write failed" };
      console.error(`[store] file persistence FAILED for lead ${record.id} — ${record.persistence.detail}`);
    }
  }
  return record;
}

export async function updateDelivery(id: string, delivery: DeliveryResult[]): Promise<void> {
  const entry = memory.find((m) => m.id === id);
  if (entry) entry.delivery = delivery;

  if (storeMode() === "file") {
    try {
      const dir = storeDir();
      const files = await fs.readdir(dir);
      const file = files.find((f) => f.endsWith(`${id}.json`));
      if (!file) return;
      const full = path.join(dir, file);
      const record = JSON.parse(await fs.readFile(full, "utf8")) as StoredLead;
      record.delivery = delivery;
      await fs.writeFile(full, JSON.stringify(record, null, 2), "utf8");
    } catch (e) {
      console.error(`[store] delivery update failed for lead ${id} — ${e instanceof Error ? e.message : "error"}`);
    }
  }
}

/** Newest first. In file mode reads durable storage, so records
 * survive restarts; memory mode returns the per-process cache. */
export async function listLeads(limit = 25): Promise<StoredLead[]> {
  if (storeMode() === "file") {
    try {
      const dir = storeDir();
      const files = (await fs.readdir(dir).catch(() => [] as string[]))
        .filter((f) => f.endsWith(".json"))
        .sort()
        .reverse()
        .slice(0, limit);
      const records = await Promise.all(
        files.map(async (f) => JSON.parse(await fs.readFile(path.join(dir, f), "utf8")) as StoredLead)
      );
      return records;
    } catch (e) {
      console.error(`[store] list failed — ${e instanceof Error ? e.message : "error"}; falling back to memory`);
    }
  }
  return memory.slice(-limit).reverse();
}

export function persistenceSummary(): { mode: PersistenceMode; durable: boolean; detail: string } {
  const mode = storeMode();
  return mode === "file"
    ? { mode, durable: true, detail: `file store at ${storeDir()}` }
    : { mode, durable: false, detail: "in-memory (demo) — leads do not survive a restart; set LEAD_STORE=file or rely on CRM_WEBHOOK_URL" };
}
