-- CreateTable
CREATE TABLE "UserScenario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scenarioName" TEXT NOT NULL,
    "inputData" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HistoricalData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "equityNominal" REAL NOT NULL,
    "equityReal" REAL NOT NULL,
    "bondNominal" REAL NOT NULL,
    "bondReal" REAL NOT NULL,
    "inflationRate" REAL NOT NULL,
    "goldReturn" REAL,
    "cashReturn" REAL
);

-- CreateTable
CREATE TABLE "SimulationResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scenarioId" TEXT NOT NULL,
    "simulationType" TEXT NOT NULL,
    "resultData" TEXT NOT NULL,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SimulationResult_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "UserScenario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalData_year_key" ON "HistoricalData"("year");

-- CreateIndex
CREATE INDEX "SimulationResult_scenarioId_idx" ON "SimulationResult"("scenarioId");
