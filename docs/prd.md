# NextFire Calculator PRD

## 1. Project Overview

The nextFire Calculator is a modern, interactive FIRE (Financial Independence, Retire Early) planning tool built with Next.js. It will allow users to enter personal financial details (current portfolio, annual spending, income streams, and additional adjustments) and simulate various retirement scenarios using historical market data. Key features include historical cycle simulations, Monte Carlo projections, variable spending strategies, scenario sharing, and detailed visualization—all while running entirely as a web app that stores user scenarios locally in a SQLite database.

The project will use modern web technologies:
- **Frontend:** Next.js, shadcn/ui components and Tailwind CSS for a sleek, responsive design.
- **Backend & Database:** A local SQLite database accessed through Prisma ORM.
- **Visualization:** Advanced React charting libraries (e.g., Recharts, D3.js, or Plotly) to render interactive, detailed graphs and dashboards.

---

## 2. Functional Requirements

### 2.1. Core Simulation Engine
- **Input Collection:**  
  - Users enter financial data (portfolio value, annual spending, income streams, contributions, tax rate, asset allocation, etc.).
  - Variable inputs for pre-retirement savings and post-retirement spending strategies (fixed, variable, percentage-of-portfolio, VPW, etc.).
- **Simulation Modes:**  
  - **Historical Simulation:** Use historical market data (from 1871 to present) to simulate retirement scenarios over each possible historical cycle.
  - **Monte Carlo Simulation:** Run randomized trials using historical distributions.
  - **Fixed-Rate Projections:** Allow simulation with constant expected returns.
- **Scenario Customization:**  
  - Allow users to input additional income or expense streams with custom start/end dates.
  - Support adjustable withdrawal strategies (including floor/ceiling limits for spending).
  - Enable scenario saving and sharing via URL generation.

### 2.2. Historical Data Integration
- **Data Sources & Coverage:**  
  - Load annual historical data from 1871 to the current year.
  - **Equity Returns:** Annual nominal and real returns for the U.S. stock market (sourced from Prof. Robert Shiller’s dataset, as used by FIRECalc and cFIREsim citeturn0search18).
  - **Bond Returns:** Annual returns from instruments such as the 10-year U.S. Treasury yield (or a composite bond index; see how cFIREsim handles bonds citeturn0search19).
  - **Inflation Data:** Annual inflation rates (using CPI or PPI data from the same source).
  - **Optional Asset Classes:**  
    - Gold prices or cash yields (if modeling multi-asset portfolios); note that quality historical cash data may be limited.
- **Data Format & Storage:**  
  - Preprocess and store the historical data as JSON or CSV files in the project repository.
  - On first run or on demand, load the processed data into SQLite via Prisma for fast, local querying.

### 2.3. Visualization and Reporting
- **Advanced Charting:**  
  - Render interactive line charts, histograms, and probability bands.
  - Enable drill-downs (e.g., hover or tap to see detailed annual simulation values).
  - Support export options (e.g., PNG image, downloadable CSV).
- **Dashboard Elements:**  
  - Summary metrics (e.g., success rate, median ending portfolio, worst-case and best-case outcomes).
  - Scenario comparison: allow multiple simulation “tabs” with checkboxes for progress tracking.

### 2.4. User Management and Session Persistence
- **Local Persistence:**  
  - Save user simulation inputs and results in a local SQLite database.
  - Allow users to retrieve and update saved scenarios.
- **Sharing:**  
  - Generate shareable URLs that encode the simulation state.

---

## 3. Non-Functional Requirements

- **Performance:**  
  - Fast simulation runs even with complex historical data (optimize queries using Prisma and efficient in-memory calculations in Next.js API routes).
  - Responsive and fluid UI interactions (leveraging Tailwind CSS and shadcn/ui).
- **Scalability:**  
  - Modular design to add new simulation models or asset classes.
  - Flexible architecture to later incorporate external APIs if live data is desired.
- **Security & Privacy:**  
  - All data remains local to the user’s browser or on a non-sensitive local SQLite database.
  - No personal data is transmitted externally.
- **Maintainability:**  
  - Well-documented code and clear separation of concerns (simulation engine, UI components, data access layer).

---

## 4. Technical Stack

### 4.1. Frontend
- **Framework:** Next.js (React-based, supports SSR and SSG)
- **UI Components:** shadcn/ui (modern, accessible component library)
- **Styling:** Tailwind CSS for rapid, responsive styling
- **Charting:** Advanced React charting libraries such as:
  - **Recharts** or **D3.js** for custom interactive graphs
  - Optionally, **Plotly.js** for more detailed, publication-quality charts

### 4.2. Backend & Database
- **Database:** Local SQLite database for storing simulation inputs and historical data.
- **ORM:** Prisma for type-safe database queries and schema management.
- **API Routes:** Next.js API routes to serve simulation results and handle data persistence.

### 4.3. Data Management
- **Historical Data Files:**  
  - CSV/JSON files containing annual data for equities, bonds, and inflation (e.g., from Shiller’s dataset).
- **Data Loader:** Scripts to preprocess and load historical data into SQLite.

### 4.4. Deployment & Development
- **Hosting:** Deploy on platforms such as Vercel (for Next.js) with serverless functions for API routes.
- **Version Control:** Git for source control with regular code reviews and automated testing (unit and integration tests).

---

## 5. Historical Data Requirements

### 5.1. Data Fields
- **Year:** The calendar year (e.g., 1871, 1872, …, current year).
- **Equity Data:**  
  - Nominal annual return (percentage)
  - Real annual return (percentage, adjusted for inflation)
  - Optionally, dividend yield (if separated)
- **Bond Data:**  
  - Nominal yield (e.g., 10-year Treasury yields)
  - Real yield (after inflation adjustment)
- **Inflation Data:**  
  - Annual inflation rate (CPI or PPI)
- **Optional – Gold/Cash:**  
  - Annual returns for gold or estimated cash growth rates

### 5.2. Data Sources
- **Primary Source:** Prof. Robert Shiller’s dataset (used by FIRECalc and cFIREsim)  
  - Provides a long-term view of stock returns, bond yields, and inflation data citeturn0search18.
- **Alternative/Additional Sources:**  
  - Other public economic datasets (if needed) for additional asset classes or updated data.

### 5.3. Data Loading Strategy
- **Preprocessing:**  
  - Write scripts (Node.js scripts) to parse CSV/JSON files and transform data into a normalized format.
- **Storage:**  
  - Load the processed data into the local SQLite database using Prisma migrations.
- **Updates:**  
  - Allow for future updates as new annual data becomes available (e.g., automatically add the most recent year).

---

## 6. User Interface & Experience

### 6.1. Input Forms
- Use shadcn/ui components for a clean and accessible form.
- Include clear labels, tooltips, and inline validation.
- Responsive layout via Tailwind CSS (mobile and desktop friendly).

### 6.2. Results Dashboard
- Display simulation outputs including charts, success rate percentages, and key statistics.
- Allow users to toggle between simulation modes (historical, Monte Carlo, fixed rate).
- Provide buttons to generate shareable URLs and download simulation data (CSV/PNG).

### 6.3. Navigation & Scenario Management
- Use tabbed navigation for switching between different saved scenarios.
- Include a “currentTask” view that shows next steps (e.g., “Run Simulation”, “View Historical Data”) and a progress tracker with checkboxes.

---

## 7. Simulation Engine & Business Logic

### 7.1. Calculation Models
- **Historical Cycle Simulation:**  
  - For each possible 30‑year (or user‑specified duration) cycle starting from 1871, calculate portfolio performance using:
    - Annual portfolio growth based on user-defined asset allocation.
    - Annual withdrawal adjustments (spending, inflation adjustment, floor/ceiling limits).
- **Monte Carlo Simulation:**  
  - Randomly sample from historical return distributions to simulate future outcomes.
- **Fixed Return Projection:**  
  - Calculate portfolio evolution using a constant rate (entered by the user).

### 7.2. Withdrawal & Spending Models
- Support multiple withdrawal models:
  - Constant withdrawal (e.g., 4% rule).
  - Variable withdrawal (e.g., VPW, percentage-of-portfolio).
  - Adjustable spending floors/ceilings.
- Ensure that calculations are performed in “today’s dollars” and then adjusted for inflation.

---

## 8. Database & Data Access Layer

### 8.1. Database Schema (SQLite)
- **UserScenarios:**  
  - id, userId (if applicable), scenarioName, inputData (JSON), createdAt, updatedAt.
- **HistoricalData:**  
  - id, year, equityNominal, equityReal, bondNominal, bondReal, inflationRate, [optional: goldReturn, cashReturn].
- **SimulationResults:**  
  - id, scenarioId, simulationType, resultData (JSON), generatedAt.

### 8.2. Prisma Integration
- Define Prisma schema models for the above tables.
- Write migration scripts to initialize and update the database schema.
- Implement service layers for querying historical data and saving user simulations.

---

## 9. Documentation & Roadmap

### 9.1. projectRoadmap.md
- **High-Level Goals:**  
  - Develop an interactive Next.js application to simulate retirement scenarios using historical data.
  - Integrate a simulation engine that supports multiple withdrawal models and adjustable parameters.
  - Ensure local persistence via SQLite and Prisma.
- **Key Features & Milestones:**  
  - Setup Next.js project with Tailwind CSS and shadcn/ui.
  - Integrate Prisma ORM and establish SQLite database schema.
  - Implement historical data loader (target: data from 1871 to present).
  - Develop simulation engine (historical, Monte Carlo, fixed rate).
  - Build interactive dashboard with advanced React charts.
  - User scenario management and shareable URL generation.
- **Completion Criteria:**  
  - Working simulation engine with accurate outputs.
  - Responsive UI with detailed visualizations.
  - Verified data persistence and scenario retrieval.
- **Progress Tracker:**  
  - Example checklist:
    - [x] Next.js project scaffolded.
    - [ ] Tailwind CSS and shadcn/ui integrated.
    - [ ] Prisma and SQLite schema defined.
    - [ ] Historical data loaded.
    - [ ] Simulation engine implemented.
    - [ ] Visualization components built.
- **Future Scalability:**  
  - Plan for integration of external APIs for live data.
  - Modularize simulation models to allow adding new asset classes.

### 9.2. currentTask.md
- **Current Objectives:**  
  - Integrate Prisma ORM with SQLite and load historical data.
  - Develop API routes in Next.js for running the simulation engine.
  - Build initial input forms using shadcn/ui components.
- **Context:**  
  - This task ties into Milestone “Historical Data Integration” and “Simulation Engine Development” from the project roadmap.
- **Next Steps:**  
  - [ ] Write data loader script for Shiller dataset.
  - [ ] Define Prisma models and perform migration.
  - [ ] Create basic API endpoint for simulation calculation.
  - [ ] Develop UI for input forms and validate data.

### 9.3. techStack.md
- **Frontend Tools:**  
  - Next.js, React, shadcn/ui, Tailwind CSS.
  - Advanced charting libraries: Recharts / D3.js / Plotly.
- **Backend Tools:**  
  - Next.js API routes, Node.js.
  - SQLite for local data persistence.
- **ORM:**  
  - Prisma for type-safe database access.
- **Architectural Decisions:**  
  - Use SSR for initial load and client-side hydration for interactive components.
  - Modular separation of simulation logic from UI.
- **Justification:**  
  - Next.js ensures performance and scalability.
  - Prisma simplifies database management.
  - shadcn/ui and Tailwind CSS offer a modern, responsive design.
  - Advanced charting libraries will provide high-quality, interactive visualizations.

### 9.4. codebaseSummary.md
- **Key Components:**  
  - **Input Form Components:** Built with shadcn/ui and Tailwind CSS for capturing user inputs.
  - **Simulation Engine:** A service layer (Node.js modules) that processes historical data and computes portfolio trajectories.
  - **Visualization Components:** React components built with advanced charting libraries (e.g., Recharts or D3.js) to render graphs and dashboards.
  - **Database Access Layer:** Prisma ORM models and API endpoints for saving/loading user scenarios.
- **Data Flow:**  
  - User inputs → Next.js API routes (simulation engine) → Historical data queried via Prisma → Calculation results → Dashboard visualizations.
- **External Dependencies:**  
  - Historical dataset files (sourced from Shiller’s dataset).
  - React charting libraries (Recharts/D3.js/Plotly).
- **Recent Changes:**  
  - Integration of Prisma and initial historical data loader.
  - UI enhancements with shadcn/ui and Tailwind CSS.
- **User Feedback Integration:**  
  - Adjustments to input forms and simulation parameters based on early tester feedback.

---

## 10. Risks & Mitigations

- **Data Accuracy:**  
  - Risk: Historical data may have gaps or inconsistencies.  
  - Mitigation: Validate data during preprocessing; provide documentation on data sources.
- **Performance Bottlenecks:**  
  - Risk: Simulation engine may run slowly with many cycles.  
  - Mitigation: Optimize algorithms; consider caching frequent queries.
- **User Interface Complexity:**  
  - Risk: Too many inputs may overwhelm users.  
  - Mitigation: Use progressive disclosure (show advanced options only when needed) and provide clear tooltips.
- **Maintenance of Historical Data:**  
  - Risk: Updating historical data each year.  
  - Mitigation: Automate data loading scripts and schedule periodic reviews.

---

## 11. Summary

The nextFire Calculator is designed to be a modern, full-featured FIRE planning tool that leverages over 150 years of historical market data to provide accurate, interactive retirement simulations. By using Next.js with shadcn/ui and Tailwind CSS on the frontend, a local SQLite database accessed through Prisma ORM on the backend, and advanced React charting libraries for data visualization, the application will offer an intuitive and powerful experience for users planning early retirement. Historical data requirements include annual data for equities, bonds, and inflation (sourced primarily from the Robert Shiller dataset), ensuring that users can simulate real-world scenarios with high accuracy.

This PRD serves as the blueprint for development, and the accompanying documents (projectRoadmap.md, currentTask.md, techStack.md, and codebaseSummary.md) will be maintained in parallel as the project evolves.