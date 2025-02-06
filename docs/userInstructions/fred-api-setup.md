# FRED API Integration Setup Guide

## Overview
The nextFire Calculator uses the Federal Reserve Economic Data (FRED) API to fetch historical market data for retirement simulations. This guide explains how to set up and verify the FRED API integration.

## Prerequisites
- Node.js and npm installed
- nextFire project cloned and dependencies installed

## Setup Steps

1. **Get a FRED API Key**
   - Visit https://fred.stlouisfed.org/docs/api/api_key.html
   - Create a free account if you don't have one
   - Request an API key
   - Copy your API key

2. **Configure Environment Variables**
   - Create a `.env` file in the project root if it doesn't exist
   - Add your FRED API key:
     ```
     DATABASE_URL="file:./nextfire.db"
     FRED_API_KEY="your-fred-api-key-here"
     ```

3. **Verify Setup**
   - Run the data loading script:
     ```bash
     npm run load-data
     ```
   - You should see output indicating successful data loading:
     ```
     Starting historical data load...
     Starting historical data load from FRED...
     Processed XX years of data
     Importing to database...
     Historical data import completed successfully
     ```

## Troubleshooting

If you encounter errors:

1. **API Key Issues**
   - Verify your API key is correctly set in the `.env` file
   - Check that there are no extra spaces or quotes around the key

2. **Database Issues**
   - Ensure Prisma is properly set up: `npx prisma generate`
   - Try resetting the database: `npx prisma db push --force-reset`

3. **Network Issues**
   - Check your internet connection
   - Verify that you can access api.stlouisfed.org

## Data Sources

The integration fetches the following data series:
- SP500: S&P 500 Index
- CPIAUCSL: Consumer Price Index
- GS10: 10-Year Treasury Rate

## Next Steps

After successful setup:
1. Historical data will be available in the SQLite database
2. The simulation engine can use this data for retirement calculations
3. You can view the data using Prisma Studio: `npx prisma studio`
