#!/usr/bin/env node
// Downloads official champion square icons from Riot's Data Dragon CDN
// into public/champions/icons/, plus an index.json mapping champion id -> filename.
// Safe to re-run periodically to pick up new champions/updated icons.

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DDRAGON_BASE = "https://ddragon.leagueoflegends.com";
const OUTPUT_DIR = path.join(__dirname, "..", "public", "champions", "icons");
const CONCURRENCY = 8;

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function downloadIcon(version, imageFile) {
  const url = `${DDRAGON_BASE}/cdn/${version}/img/champion/${imageFile}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(path.join(OUTPUT_DIR, imageFile), buffer);
  return imageFile;
}

async function runWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;

  async function runNext() {
    while (next < items.length) {
      const current = next++;
      try {
        results[current] = { ok: true, value: await worker(items[current]) };
      } catch (err) {
        results[current] = { ok: false, error: err };
      }
    }
  }

  await Promise.all(Array.from({ length: limit }, runNext));
  return results;
}

async function main() {
  console.log("Fetching latest Data Dragon version...");
  const versions = await fetchJson(`${DDRAGON_BASE}/api/versions.json`);
  const version = versions[0];
  console.log(`Using Data Dragon version ${version}`);

  console.log("Fetching champion list...");
  const championData = await fetchJson(
    `${DDRAGON_BASE}/cdn/${version}/data/en_US/champion.json`
  );
  const champions = Object.values(championData.data);
  console.log(`Found ${champions.length} champions.`);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  console.log(`Downloading icons (concurrency ${CONCURRENCY})...`);
  const results = await runWithConcurrency(champions, CONCURRENCY, (champion) =>
    downloadIcon(version, champion.image.full)
  );

  const index = { version, champions: {} };
  let failures = 0;
  results.forEach((result, i) => {
    const champion = champions[i];
    if (result.ok) {
      index.champions[champion.id] = champion.image.full;
    } else {
      failures += 1;
      console.error(`Failed to download ${champion.id}: ${result.error.message}`);
    }
  });

  await fs.writeFile(
    path.join(OUTPUT_DIR, "index.json"),
    JSON.stringify(index, null, 2)
  );

  console.log(
    `Done. ${Object.keys(index.champions).length}/${champions.length} icons saved to ${OUTPUT_DIR}` +
      (failures ? ` (${failures} failed, see errors above)` : "")
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
