# Test Coverage Documentation

This document explains how test coverage is set up and managed in the Egg Timer project.

## Overview

The project uses Jest for testing and coverage reporting with the following configuration:

- **Coverage Threshold**: 80% for all metrics (statements, branches, functions, lines)
- **Coverage Reporters**: text, lcov, html, json-summary
- **Coverage Directory**: `coverage/`

## Available Scripts

### Basic Testing

```bash
npm test                    # Run tests
npm run test:watch         # Run tests in watch mode
npm run test:ci            # Run tests for CI (no watch, with coverage)
```

### Coverage Scripts

```bash
npm run test:coverage      # Run tests with coverage report
npm run coverage:open      # Open coverage report in browser
npm run coverage:report    # Generate and open coverage report
npm run coverage:badge     # Update coverage badge in README
npm run coverage:update    # Generate coverage and update badge
```

## Coverage Reports

After running `npm run test:coverage`, you'll find:

- **HTML Report**: `coverage/lcov-report/index.html` - Interactive coverage report
- **LCOV Data**: `coverage/lcov.info` - For CI/CD integration
- **JSON Summary**: `coverage/coverage-summary.json` - Machine-readable summary
- **Text Report**: Displayed in terminal

## Coverage Badge

The project automatically updates coverage badges in the README.md file:

- **Shields.io Badge**: Shows current coverage percentage with color coding
- **Coverage Section**: Displays detailed coverage metrics
- **Auto-Update**: Run `npm run coverage:update` to refresh

### Badge Colors

- 🟢 **90%+**: brightgreen
- 🟢 **80-89%**: green
- 🟡 **70-79%**: yellowgreen
- 🟡 **60-69%**: yellow
- 🟠 **50-59%**: orange
- 🔴 **<50%**: red

## CI/CD Integration

### GitHub Actions

The project includes a CI workflow (`.github/workflows/ci.yml`) that:

1. Runs tests on Node.js 18.x and 20.x
2. Generates coverage reports
3. Uploads coverage to Codecov (if configured)
4. Builds the project
5. Uploads build artifacts

### Codecov Integration

To set up Codecov:

1. Sign up at [codecov.io](https://codecov.io)
2. Connect your GitHub repository
3. Add the repository token to GitHub Secrets (optional)
4. The workflow will automatically upload coverage data

## Coverage Thresholds

Current thresholds (configured in `jest.config.js`):

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

## Improving Coverage

To improve test coverage:

1. **Identify gaps**: Check the HTML coverage report
2. **Add tests**: Focus on uncovered lines and branches
3. **Test edge cases**: Ensure all conditional paths are tested
4. **Mock dependencies**: Use Jest mocks for external dependencies
5. **Update thresholds**: Gradually increase thresholds as coverage improves

## Best Practices

1. **Run coverage regularly**: Use `npm run coverage:update` before commits
2. **Review coverage reports**: Check the HTML report for detailed insights
3. **Maintain thresholds**: Don't lower thresholds; improve coverage instead
4. **Test user interactions**: Use React Testing Library for component tests
5. **Mock external APIs**: Ensure tests don't depend on external services

## Troubleshooting

### Coverage not updating

- Ensure `coverage-summary.json` exists after running tests
- Check that Jest is configured to generate JSON summary
- Verify the script has proper permissions

### Badge not updating

- Check that the coverage summary file exists
- Ensure the README.md file is writable
- Verify the script is using the correct file paths

### CI failures

- Check that all tests pass locally
- Ensure coverage thresholds are met
- Verify GitHub Actions workflow configuration
