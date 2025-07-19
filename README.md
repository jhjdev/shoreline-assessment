# Shoreline Weather Assessment - Enterprise-Grade React Application

This application was originally developed as an assessment for Shoreline Wind's Lead Technical Developer position in September 2023. Since then, it has been continuously maintained and evolved into a comprehensive, production-ready weather application with modern development practices and infrastructure.

## 🌟 Key Features

- **Modern Weather Interface**: Clean, responsive UI built with React 18 and TypeScript
- **Real-time Weather Data**: Integration with 7timer.info weather API
- **Multiple Forecast Views**: Current weather, 5-day forecast, and 7-day forecast
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Comprehensive Testing**: Unit tests with Jest and E2E tests with Playwright
- **CI/CD Pipeline**: Automated testing, linting, and deployment with GitHub Actions

## 🚀 Tech Stack

### Core Technologies

- **Frontend**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 7.0.5 for fast development and optimized builds
- **Styling**: Tailwind CSS with PostCSS processing
- **Routing**: React Router for client-side navigation
- **State Management**: Custom React state management

### Development & Testing

- **Package Manager**: Yarn 3.6.4 with Corepack
- **Testing Framework**: Jest for unit tests, Playwright for E2E tests
- **Linting**: ESLint with React and TypeScript rules
- **Type Checking**: Strict TypeScript configuration

### Infrastructure

- **CI/CD**: GitHub Actions with multi-node testing matrix
- **Code Quality**: Automated linting, type checking, and testing
- **Build Optimization**: Production builds with asset optimization
- **Dependency Management**: Yarn Berry with zero-installs architecture

## 📦 Installation & Setup

### Prerequisites

- Node.js 18.x or 20.x
- Yarn (managed via Corepack)

### Quick Start

```bash
# Enable Corepack (if not already enabled)
corepack enable

# Install dependencies
yarn install

# Start development server
yarn dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

## 🛠 Available Scripts

### Development

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn preview      # Preview production build locally
```

### Code Quality

```bash
yarn lint         # Check for linting errors
yarn lint:fix     # Fix linting errors automatically
yarn tsc          # Type checking without emitting files
```

### Testing

```bash
yarn test         # Run unit tests
yarn test:watch   # Run unit tests in watch mode
yarn test:e2e     # Run end-to-end tests
```

## 🏗 Project Structure

```
shoreline-assessment/
├── .github/workflows/     # GitHub Actions CI/CD pipeline
├── src/
│   ├── components/        # Reusable React components
│   ├── hooks/            # Custom React hooks and utilities
│   ├── pages/            # Page components for routing
│   ├── routes/           # React Router configuration
│   ├── services/         # API services and external integrations
│   ├── state/            # State management
│   └── assets/           # Static assets and SVG components
├── tests/
│   ├── unit/             # Jest unit tests
│   └── e2e/              # Playwright E2E tests
└── public/               # Static public assets
```

## 🔄 CI/CD Pipeline

The project includes a comprehensive GitHub Actions pipeline that:

- **Multi-Node Testing**: Tests on Node.js 18.x and 20.x
- **Code Quality Checks**: Runs ESLint and TypeScript compiler
- **Automated Testing**: Executes unit tests and E2E tests
- **Build Verification**: Ensures production builds are successful
- **Artifact Management**: Stores build artifacts and test reports

### Pipeline Stages

1. **Lint & Type Check**: Code quality validation
2. **Unit Tests**: Jest test suite execution
3. **Build**: Production build verification
4. **E2E Tests**: End-to-end testing with Playwright

## 📋 Testing Strategy

### Unit Tests

- **Framework**: Jest with TypeScript support
- **Coverage**: Component logic, utilities, and hooks
- **Location**: `tests/unit/`

### End-to-End Tests

- **Framework**: Playwright
- **Coverage**: Complete user workflows and integrations
- **Location**: `tests/e2e/`

## 🌡 Weather API Integration

The application integrates with the 7timer.info API to provide:

- Current weather conditions
- 5-day detailed forecasts
- 7-day extended forecasts
- Location-based weather data

## 🔧 Configuration

### TypeScript

- Strict type checking enabled
- Modern ES2020 target with DOM libraries
- React JSX transformation

### Build Configuration

- Vite for fast development and optimized production builds
- PostCSS with Tailwind CSS processing
- Asset optimization and code splitting

## 📝 Changelog

### Latest Updates (July 2025)

- **Infrastructure Modernization**: Complete CI/CD pipeline implementation
- **Package Manager Migration**: Switched to Yarn 3.6.4 with Corepack
- **Testing Enhancement**: Consolidated test structure and added E2E tests
- **Code Quality**: Fixed React hooks violations and TypeScript issues
- **Automation**: GitHub Actions pipeline with comprehensive quality checks

### March 2025

- Upgraded packages and setup to use the latest versions
- Refactoring: Moved API calls to dedicated service files
- Added better tooltip to the 5-day forecast
- Made minor UI changes to the sidebar
- Added lint checks and unit tests

## 🎯 Future Roadmap

### Planned Features

- **Enhanced UX**: Loading states with descriptive messages
- **User Location**: Header with location-based information and daily content
- **Extended Content**: Quotes, fun facts, and additional contextual information
- **Branding**: Footer with contact information and project details

### Technical Improvements

- Performance optimization with React.memo and useMemo
- Enhanced error handling and user feedback
- Progressive Web App (PWA) capabilities
- Advanced caching strategies for weather data

## 🤝 Contributing

This project maintains high code quality standards:

1. **Code Style**: Follow ESLint rules and TypeScript best practices
2. **Testing**: Add tests for new features and bug fixes
3. **Documentation**: Update README and inline comments
4. **CI/CD**: Ensure all pipeline checks pass before merging

## 📄 License

This project was developed as part of a technical assessment and is maintained for educational and portfolio purposes.
