# nextFire Calculator

<div align="center">

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-green)](https://www.prisma.io/)

</div>

## Overview

The nextFire Calculator is a comprehensive FIRE (Financial Independence, Retire Early) planning tool that leverages historical market data to help users plan their retirement strategy. Built with modern web technologies and following a local-first architecture, it provides accurate simulations while ensuring user privacy.

### Key Features

- 🔄 Historical cycle simulations (1955-present)
- 📊 Portfolio value and asset allocation planning
- 💰 Multiple withdrawal strategy support
- 📈 Interactive visualization tools
- 🔒 Local-first architecture for data privacy
- 📱 Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- A FRED API key (see [FRED API Setup](docs/userInstructions/fred-api-setup.md))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BioInfo/nextfire.git
cd nextfire
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your FRED API key
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Load historical data:
```bash
npm run load-data
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Documentation

- [Project Roadmap](docs/projectRoadmap.md)
- [Technical Documentation](docs/techStack.md)
- [User Instructions](docs/userInstructions/)

## Architecture

The nextFire Calculator is built with:

- **Frontend**: Next.js 14 with TypeScript and shadcn/ui
- **Database**: SQLite with Prisma ORM
- **Data Source**: Federal Reserve Economic Data (FRED) API
- **State Management**: React Context and Hooks
- **Testing**: Jest and React Testing Library

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License - see the [LICENSE](LICENSE) file for details.

Copyright © 2025 J&S Group, LLC. All rights reserved.

## Acknowledgments

- Historical market data provided by [Federal Reserve Economic Data (FRED)](https://fred.stlouisfed.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Built with [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/)
