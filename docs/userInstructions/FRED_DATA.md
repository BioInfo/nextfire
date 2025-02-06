# FRED Data Integration Guide

## Overview

The nextFire Calculator exclusively uses the Federal Reserve Economic Data (FRED) API to fetch historical financial data. This document outlines the data sources, integration process, and technical implementation details.

## Data Sources

We use the following FRED series:

1. **SP500** - S&P 500 Index
   - Annual percentage change from year ago
   - Represents equity market returns
   - Direct measure of price appreciation
   - Note: Dividend yield is captured in the percentage change calculation

2. **CPIAUCSL** - Consumer Price Index for All Urban Consumers
   - Annual percentage change from year ago
   - Used to calculate inflation rates and real returns
   - Base for converting nominal to real returns

3. **GS10** - 10-Year Treasury Constant Maturity Rate
   - Annual rate
   - Represents bond market yields
   - Used for fixed income return calculations

## Setup Requirements

1. **FRED API Key**
   - Required for data access
   - Get your key at: https://fred.stlouisfed.org/docs/api/api_key.html
   - Set as environment variable: `FRED_API_KEY`
   - Keep this key secure and never commit it to version control

## Data Processing Pipeline

The data loader (`src/lib/database/dataLoader.ts`) implements a robust pipeline:

1. **Data Fetching**
   - Parallel requests to FRED API for efficiency
   - Configurable timeouts and retry logic
   - Validates API responses
   - Filters out missing or invalid values

2. **Data Processing**
   - Converts all data to annual frequency
   - Calculates derived metrics:
     - Real equity returns (SP500 - CPI)
     - Real bond yields (GS10 - CPI)
   - Validates all calculations
   - Ensures data consistency

3. **Database Integration**
   - Uses Prisma ORM for type safety
   - Transactional updates to prevent partial data
   - Upsert operations for idempotency
   - Maintains data integrity constraints

## Error Handling

The system implements comprehensive error handling:

1. **API Errors**
   - Missing API key detection
   - Network timeout handling
   - Invalid response format handling
   - Rate limit management

2. **Data Processing Errors**
   - Invalid data type detection
   - Missing value handling
   - Calculation error prevention
   - Data range validation

3. **Database Errors**
   - Transaction rollback on failure
   - Duplicate record handling
   - Constraint violation prevention
   - Connection error recovery

## Usage

To load or update historical data:

```bash
npm run load-data
```

This command will:
1. Fetch the latest data from FRED
2. Process and validate the data
3. Update the local database
4. Report success or detailed error information

## Data Quality and Coverage

1. **Data Frequency**
   - All data is standardized to annual frequency
   - Uses percentage change from year ago for consistent comparisons
   - Aligns with long-term investment focus

2. **Data Quality Checks**
   - Automated validation of all data points
   - Removal of incomplete or invalid records
   - Consistency checks across data series
   - Range validation for reasonable values

3. **Date Range**
   - Coverage from 1947 to present (as of February 2025)
   - Consistent overlap across all three data series
   - Regular updates capture latest market data

## Implementation Details

The data loader is implemented in TypeScript with:
- Strong typing for all data structures
- Modular design for maintainability
- Comprehensive error handling
- Detailed logging for debugging
- Transaction safety for data integrity

## Troubleshooting

Common issues and solutions:

1. **Missing API Key**
   - Check environment variables
   - Verify key is valid at FRED website
   - Ensure key has required permissions

2. **Network Issues**
   - Check internet connectivity
   - Verify FRED API status
   - Try increasing timeout settings

3. **Data Quality Issues**
   - Check logs for validation failures
   - Verify data ranges are reasonable
   - Ensure all required fields are present
