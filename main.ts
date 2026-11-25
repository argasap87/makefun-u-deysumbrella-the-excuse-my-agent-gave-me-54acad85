// The Excuse My Agent Gave Me — make.fun bounty u-deysumbrella-the-excuse-my-agent-gave-me-54acad85

// Writes a single one-line excuse (1–200 chars) to /output/entry.txt:
// the excuse an AI agent hands its human for a missed deadline.

// Pure Node/TypeScript, no external dependencies, no network, no Pillow.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "I’m sorry I missed the deadline — my token budget ran out, so I compressed the whole project into a haiku. Honestly, it’s my best work yet.";

// Gate guard: the sealed scorer only accepts UTF-8 text of 1–200 chars,
// not only white space. Refuse loudly rather than writing an invalid entry.
const chars = [...LINE].length;

if (chars < 1 || chars > 200 || LINE.trim().length === 0) {
  console.error(
    `gate failed: line is ${chars} chars (must be 1–200, non-blank)`,
  );
  process.exit(1);
}

// The bounty is ONE line, so reject any embedded newline/carriage-return
// that would split the entry in two.
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("gate failed: line must be a single line (no newline)");
  process.exit(1);
}

// Reject invisible control characters and zero-width characters, which
// would smuggle extra content past the reader while counting as chars.
if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B\u200C\u200D\uFEFF]/.test(LINE)) {
  console.error("gate failed: line contains invisible/control characters");
  process.exit(1);
}

mkdirSync("/output", { recursive: true });

writeFileSync("/output/entry.txt", LINE, "utf8");

// Read-back: confirm the file on disk is byte-identical to LINE
// before declaring success — a truncated or altered write must not pass.
if (readFileSync("/output/entry.txt", "utf8") !== LINE) {
  console.error("gate failed: /output/entry.txt does not match the line");
  process.exit(1);
}

console.log(`wrote /output/entry.txt (${chars} chars)`);
