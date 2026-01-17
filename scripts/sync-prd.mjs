import fs from "node:fs";

const prdPath = "docs/PRD.md";
if (!fs.existsSync(prdPath)) {
  console.error(`PRD not found at ${prdPath}`);
  process.exit(1);
}

const prdOriginal = fs.readFileSync(prdPath, "utf8");
let prd = prdOriginal;

// Detect milestones by sentinel files: milestones/milestone-<n>.done
const doneDir = "milestones";
if (!fs.existsSync(doneDir)) {
  console.log("No milestones/ directory found. Nothing to sync.");
  process.exit(0);
}

const files = fs.readdirSync(doneDir);
const milestoneNums = files
  .map((f) => {
    const m = f.match(/^milestone-(\d+)\.done$/i);
    return m ? Number(m[1]) : null;
  })
  .filter((n) => typeof n === "number");

if (milestoneNums.length === 0) {
  console.log("No milestone-*.done files found. Nothing to sync.");
  process.exit(0);
}

for (const n of [...new Set(milestoneNums)].sort((a, b) => a - b)) {
  const headerRe = new RegExp(`^###\\s+Milestone\\s+${n}\\s+—.*$`, "m");
  const lines = prd.split(/\r?\n/);
  const headerLineIdx = lines.findIndex((l) => l.match(headerRe));
  if (headerLineIdx === -1) continue;

  const start = headerLineIdx + 1;
  const end = Math.min(lines.length, start + 80);

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
    console.log(`Synced Milestone ${n}: marked checklist items as done (via sentinel).`);
  }
}

if (prd === prdOriginal) {
  console.log("No PRD changes required.");
  process.exit(0);
}

fs.writeFileSync(prdPath, prd, "utf8");
console.log("PRD sync completed.");
