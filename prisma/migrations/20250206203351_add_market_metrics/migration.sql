-- Step 1: Add nullable columns
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HistoricalData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "equityNominal" REAL NOT NULL,
    "equityReal" REAL NOT NULL,
    "bondNominal" REAL NOT NULL,
    "bondReal" REAL NOT NULL,
    "inflationRate" REAL NOT NULL,
    "goldReturn" REAL,
    "cashReturn" REAL,
    "peRatio" REAL,
    "dividendYield" REAL
);
INSERT INTO "new_HistoricalData" ("bondNominal", "bondReal", "cashReturn", "equityNominal", "equityReal", "goldReturn", "id", "inflationRate", "year") SELECT "bondNominal", "bondReal", "cashReturn", "equityNominal", "equityReal", "goldReturn", "id", "inflationRate", "year" FROM "HistoricalData";
DROP TABLE "HistoricalData";
ALTER TABLE "new_HistoricalData" RENAME TO "HistoricalData";
CREATE UNIQUE INDEX "HistoricalData_year_key" ON "HistoricalData"("year");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- Step 2: Set default values for existing records
UPDATE "HistoricalData" SET
    "peRatio" = 15.0,
    "dividendYield" = 0.04
WHERE "peRatio" IS NULL OR "dividendYield" IS NULL;

-- Step 3: Make columns required
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HistoricalData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "equityNominal" REAL NOT NULL,
    "equityReal" REAL NOT NULL,
    "bondNominal" REAL NOT NULL,
    "bondReal" REAL NOT NULL,
    "inflationRate" REAL NOT NULL,
    "goldReturn" REAL,
    "cashReturn" REAL,
    "peRatio" REAL NOT NULL,
    "dividendYield" REAL NOT NULL
);
INSERT INTO "new_HistoricalData" SELECT * FROM "HistoricalData";
DROP TABLE "HistoricalData";
ALTER TABLE "new_HistoricalData" RENAME TO "HistoricalData";
CREATE UNIQUE INDEX "HistoricalData_year_key" ON "HistoricalData"("year");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
