import { execSync } from "node:child_process";
import fs from "node:fs";

function sh(cmd) {
  return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] }).toString("utf8").trim();
}

const prdPath = "docs/PRD.md";
if (!fs.existsSync(prdPath)) {
  console.error(`PRD not found at ${prdPath}`);
  process.exit(1);
}

const log = sh("git log --pretty=format:%s --max-count=200");
const subjects = log.split(/\r?\n/).filter(Boolean);

// Detect milestones from commit subjects like: chore(milestone-0): ...
const milestoneNums = new Set();
for (const s of subjects) {
  const m = s.match(/\bmilestone-(\d+)\b/i);
  if (m) milestoneNums.add(Number(m[1]));
}

if (milestoneNums.size === 0) {
  console.log("No milestone commits found in recent history. Nothing to sync.");
  process.exit(0);
}

let prd = fs.readFileSync(prdPath, "utf8");
let changed = false;

for (const n of [...milestoneNums].sort((a, b) => a - b)) {
  // Find the milestone section header: ### Milestone N —
  const headerRe = new RegExp(`^###\\s+Milestone\\s+${n}\\s+—.*$`, "m");
  const headerMatch = prd.match(headerRe);
  if (!headerMatch) continue;

  // Work on a window after the header to avoid touching other milestones.
  const lines = prd.split(/\r?\n/);
  const headerLineIdx = lines.findIndex((l) => l.match(headerRe));
  if (headerLineIdx === -1) continue;

  const start = headerLineIdx + 1;
  const end = Math.min(lines.length, start + 60);

  let localChanged = false;
  for (let i = start; i < end; i++) {
    if (/^###\s+Milestone\s+\d+\s+—/i.test(lines[i])) break;

    if (/^- \[ \]/.test(lines[i])) {
      lines[i] = lines[i].replace(/^- \[ \]/, "- [x]");
      localChanged = true;
    }
  }

  if (localChanged) {
    prd = lines.join("\n");
    changed = true;
    console.log(`Synced Milestone ${n}: marked checklist items as done.`);
  }
}

if (!changed) {
  console.log("No PRD changes required.");
  process.exit(0);
}

fs.writeFileSync(prdPath, prd, "utf8");
console.log("PRD sync completed.");
