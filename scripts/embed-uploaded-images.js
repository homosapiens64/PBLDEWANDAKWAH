/*
 * One-time migration: convert on-disk image references into inline data URLs.
 *
 * Why: uploaded images used to be saved as files under public/uploads and only
 * their PATH was stored in the database. Those files are NOT shared between
 * developers, so images uploaded on one machine appear broken on another that
 * shares the same database.
 *
 * This script reads every image still referenced as "/uploads/..." and rewrites
 * the database value to a base64 data URL, so the image travels with the
 * database and shows up on every machine.
 *
 * IMPORTANT: run this on the machine that ACTUALLY HAS the image files in
 * public/uploads (e.g. the teammate who uploaded them). Rows whose file is
 * missing locally are skipped and reported.
 *
 * Usage:  node scripts/embed-uploaded-images.js
 */
const { PrismaClient } = require("@prisma/client");
const { readFile } = require("fs/promises");
const path = require("path");

const prisma = new PrismaClient();

const mimeByExt = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const models = ["news", "studyArticle", "educationInformation"];

async function embedFor(model) {
  const rows = await prisma[model].findMany({ select: { id: true, title: true, imageUrl: true } });
  let converted = 0;
  let missing = 0;
  let skipped = 0;

  for (const row of rows) {
    const url = row.imageUrl || "";
    if (!url.startsWith("/uploads/")) {
      skipped++;
      continue;
    }

    const ext = path.extname(url).toLowerCase();
    const mime = mimeByExt[ext];
    if (!mime) {
      // e.g. a PDF reference - leave it as a file link.
      skipped++;
      continue;
    }

    const filePath = path.join(process.cwd(), "public", url.replace(/^\//, ""));
    try {
      const bytes = await readFile(filePath);
      const dataUrl = `data:${mime};base64,${bytes.toString("base64")}`;
      await prisma[model].update({ where: { id: row.id }, data: { imageUrl: dataUrl } });
      converted++;
      console.log(`  ✓ ${model}#${row.id} embedded (${(bytes.length / 1024).toFixed(0)} KB) — ${row.title}`);
    } catch {
      missing++;
      console.warn(`  ✗ ${model}#${row.id} file NOT found: ${url} — ${row.title}`);
    }
  }

  console.log(`${model}: converted=${converted} missing=${missing} skipped=${skipped}`);
}

(async () => {
  console.log("Embedding uploaded images into the database...\n");
  for (const model of models) {
    await embedFor(model);
  }
  console.log("\nDone.");
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
