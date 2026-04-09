import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const OUT_PATH = path.join(DATA_DIR, "fleet-metrics.json");
const PUBLIC_OUT_PATH = path.join(ROOT, "public", "fleet-metrics.json");

const REQUIRED_COLS = ["Group Company", "Fleet No", "OB No", "Avg Size"];

function normalizeKey(k) {
  return String(k ?? "").trim().replace(/\s+/g, " ");
}

function pickCols(row) {
  const out = {};
  for (const col of REQUIRED_COLS) out[col] = row[col] ?? null;
  return out;
}

function readWorkbook(filePath) {
  const wb = xlsx.readFile(filePath, { cellDates: true });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return { sheetName: null, rows: [] };
  const ws = wb.Sheets[sheetName];

  // Some exports include a few preface rows; detect header row by finding "Fleet No"
  const matrix = xlsx.utils.sheet_to_json(ws, { header: 1, defval: null });
  const headerRowIndex = matrix.findIndex((row) =>
    Array.isArray(row) && row.some((cell) => normalizeKey(cell) === "Fleet No")
  );

  if (headerRowIndex < 0) return { sheetName, rows: [] };

  const header = (matrix[headerRowIndex] ?? []).map((h) => normalizeKey(h));
  const rows = matrix
    .slice(headerRowIndex + 1)
    .filter((r) => Array.isArray(r) && r.some((c) => c != null && String(c).trim() !== ""))
    .map((r) => {
      const obj = {};
      for (let i = 0; i < header.length; i++) {
        const key = header[i];
        if (!key) continue;
        obj[key] = r[i] ?? null;
      }
      return obj;
    });

  return { sheetName, rows };
}

function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`Missing data dir: ${DATA_DIR}`);
    process.exit(1);
  }

  const xlsxFiles = fs
    .readdirSync(DATA_DIR)
    .filter((f) => {
      if (!f.toLowerCase().endsWith(".xlsx")) return false;
      // exclude Excel temp/lock files
      if (f.startsWith("~$")) return false;
      if (f.startsWith(".~")) return false;
      if (f.startsWith(".")) return false;
      return true;
    })
    .map((f) => path.join(DATA_DIR, f))
    .sort((a, b) => a.localeCompare(b));

  if (xlsxFiles.length === 0) {
    console.error("No .xlsx files found under data/");
    process.exit(1);
  }

  const result = {
    generatedAt: new Date().toISOString(),
    files: [],
  };

  for (const fp of xlsxFiles) {
    const { sheetName, rows } = readWorkbook(fp);
    const picked = rows.map(pickCols);

    const missing = REQUIRED_COLS.filter((c) => rows.length === 0 || !(c in rows[0]));

    const record = {
      file: path.basename(fp),
      sheetName,
      rowCount: picked.length,
      missingColumns: missing,
      data: picked,
    };

    result.files.push(record);

    console.log(
      `${record.file}: rows=${record.rowCount}, sheet=${record.sheetName ?? "-"}, missing=[${record.missingColumns.join(
        ", "
      )}]`
    );
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(result, null, 2), "utf-8");
  console.log(`\nWrote ${OUT_PATH}`);

  fs.mkdirSync(path.dirname(PUBLIC_OUT_PATH), { recursive: true });
  fs.writeFileSync(PUBLIC_OUT_PATH, JSON.stringify(result, null, 2), "utf-8");
  console.log(`Wrote ${PUBLIC_OUT_PATH}`);
}

main();

