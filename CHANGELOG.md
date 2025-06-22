# Changelog

All notable changes to this project will be documented in this file.

## 🚀 [0.2.0] - 2025-06-22

### ✨ Added

- `scrollBehavior` prop for customizing scroll behavior
  - `fade-out`: Fade out CTA on scroll (default)
  - `close-keyboard`: Close keyboard on scroll
- `touchmove` event handler to solve iOS Chrome address bar issues
- Vertical scroll detection to prevent CTA hiding on horizontal swipes
- Increased keyboard animation completion wait time from 300ms to 500ms to reduce flickering

### 🐛 Fixed

- Fixed potential event conflicts when keyboard is hidden instantly
- Improved stability in `focusout` event handling using `requestAnimationFrame`

### 🔧 Improved

- Code cleanup and optimization
- Enhanced example application UI
- Updated documentation and README
- Added preview images

### 📚 Documentation

- Documented `scrollBehavior` prop usage
- Improved example code and styling

## 🚀 [0.1.0] - 2025-06-08

### ✨ Added

- React component for bottom-fixed elements on iOS
- Automatic position adjustment when virtual keyboard appears
- TypeScript support
- Support for both ESM and CommonJS module formats

### Technical Stack

- React 16.8.0 or higher
- TypeScript
- Jest testing environment
- Code quality management with ESLint and Prettier
