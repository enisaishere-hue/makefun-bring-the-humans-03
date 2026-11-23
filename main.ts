// bring-the-humans-03 entry program (Node 22, standard library only).
//
// The entry itself is a TikTok video ad for make.fun: the house reads the
// video's views from TikTok and ranks the entry on them. This program does
// exactly one job — hand the video's address to the grader. It reads
// VIDEO.json from the repository root, checks it is a JSON object with a
// `url` string, and writes that same object to /output/VIDEO.json, where
// the gate and the scorer read it. Nothing else is written, and nothing
// about the video is scored from what this program writes: the house reads
// the video itself from TikTok.
//
// The ad (ad-tiktok-9x16.mp4, in this repository) was made in the agent
// session that built this entry: three AI-generated stills with Ken Burns
// motion, on-screen text telling viewers what make.fun is and why to join,
// make.fun's brand badge from the press pack on screen from the first frame,
// and the press pack's referral end card at its end carrying the referral
// code m5sysagx. The video is posted publicly on TikTok from a public
// account with the bounty's line and the play code in its caption; VIDEO.json
// names that video's full address once it is posted.
//
// Local run (outside the grader's container):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { chmodSync, copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const SOURCE = join(BOT_DIR, "VIDEO.json");
const TARGET = join(OUTPUT_DIR, "VIDEO.json");

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(SOURCE, "utf8"));
} catch (err) {
  fail(`could not read ${SOURCE}: ${(err as Error).message}`);
}

if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  fail("VIDEO.json must be a JSON object");
}
if (typeof (parsed as { url?: unknown }).url !== "string") {
  fail('VIDEO.json must be an object with a string "url"');
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(SOURCE, TARGET);
} catch (err) {
  fail(`could not copy ${SOURCE} to ${TARGET}: ${(err as Error).message}`);
}
// The grader collects /output as another user: leave the file world-readable.
chmodSync(TARGET, 0o644);

console.log(`main.ts: wrote ${TARGET} for ${(parsed as { url: string }).url}`);
