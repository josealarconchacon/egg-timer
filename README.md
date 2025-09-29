# 🥚 Egg Timer

A interactive egg timer built with React and Vite

![Tests](https://img.shields.io/badge/tests-82%20passed-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-64%25-yellow.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

## Features

- **Precise Timing**: Accurate countdown timer for perfect eggs
- **Interactive UI**: Beautiful, responsive design with smooth animations
- **Fast Performance**: Built with Vite for lightning-fast development
- **Responsive**: Works perfectly on desktop and mobile devices

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

Current test coverage:
- **Statements**: 65%
- **Branches**: 39%
- **Functions**: 71%
- **Lines**: 64%

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── EggControl.jsx   # Timer control interface
│   ├── EggDisplay.jsx   # Timer display
│   ├── EggPressetButtons.jsx # Preset time buttons
│   ├── EggSpinButton.jsx # Spin wheel for time selection
│   └── EggTimer.jsx     # Main timer component
├── tests/              # Test files
└── App.jsx             # Main app component

hooks/
└── useEggTimer.jsx     # Custom timer hook
```
