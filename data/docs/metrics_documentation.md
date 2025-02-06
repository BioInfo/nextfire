# Shiller Stock Market Data Documentation

This directory contains historical stock market data originally compiled by Robert Shiller for his book "Irrational Exuberance" (Princeton University Press). The data has been reorganized into focused categories for easier analysis by LLMs.

## Directory Structure

```
data/
├── market/           # Core market data
│   ├── stock_prices.csv    # Monthly S&P composite prices
│   ├── dividends.csv       # Monthly dividend data
│   └── earnings.csv        # Monthly earnings data
├── economic/         # Economic indicators
│   ├── cpi.csv            # Consumer Price Index
│   ├── interest_rates.csv # Long-term interest rates
│   └── date_fractions.csv # Date fraction data
└── metrics/          # Derived metrics and ratios
    ├── pe_ratios.csv      # Price-earnings ratios
    ├── yields.csv         # Dividend and earnings yields
    └── real_values.csv    # Inflation-adjusted values
```

## Data Categories

### Market Data
- **stock_prices.csv**: Monthly S&P Composite Price Index
  - Date: Month and year (YYYY.MM format)
  - Price: Nominal price
  - Real_Price: Inflation-adjusted price (Current USD)

- **dividends.csv**: Monthly dividend data
  - Date: Month and year
  - Dividend: Nominal dividend amount
  - Real_Dividend: Inflation-adjusted dividend

- **earnings.csv**: Monthly earnings data
  - Date: Month and year
  - Earnings: Nominal earnings
  - Real_Earnings: Inflation-adjusted earnings

### Economic Indicators
- **cpi.csv**: Consumer Price Index
  - Date: Month and year
  - CPI: Consumer Price Index value
  - Inflation_Rate: Year-over-year inflation rate

- **interest_rates.csv**: Long-term interest rates
  - Date: Month and year
  - Rate: Long Interest Rate (GS10)
  - Real_Rate: Inflation-adjusted rate

### Valuation Metrics
- **pe_ratios.csv**: Price-earnings ratios
  - Date: Month and year
  - PE: Price-Earnings Ratio
  - CAPE: Cyclically Adjusted Price Earnings Ratio (P/E10)
  - TR_CAPE: Total Return CAPE

- **yields.csv**: Various yield metrics
  - Date: Month and year
  - Dividend_Yield: Dividend/Price
  - Earnings_Yield: Earnings/Price
  - Excess_CAPE_Yield: ECY metric

## Notes
- All real values are adjusted using CPI to current USD
- Missing values are denoted as NA
- Data is updated through February 2024
- Original source: Robert Shiller's Stock Market Data Used in "Irrational Exuberance"
