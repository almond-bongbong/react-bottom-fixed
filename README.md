# 🛠️ Module Template

A boilerplate template for creating Node modules with React and TypeScript.

## 🌟 Features

- React and TypeScript support
- Testing environment with Jest and React Testing Library
- Code formatting and linting with ESLint and Prettier
- TypeScript compiler configuration
- Automatic module type definitions
- Modern npm package format (2.0.0)
- ES Modules (ESM) and CommonJS support

## 📦 Project Structure

```
.
├── src/           # Source code
│   ├── cjs/      # CommonJS format
│   ├── esm/      # ES Modules format
│   └── types/    # Type definition files
├── tests/         # Test files
├── example/       # Example code
└── types/         # Type definition files
```

## 🔧 Dependencies

### Core Dependencies

- `react` (>=16.8.0)
- `react-dom` (>=16.8.0)

### Development Dependencies

- `typescript`: Static type support
- `jest` & `@testing-library/react`: Testing environment
- `eslint` & `prettier`: Code quality management
- `sass`: CSS preprocessor

## 📦 Packaging

### Modern Package Format

This template follows the modern npm package format (2.0.0) with the following features:

- **Dual Module Support**: Supports both ES Modules and CommonJS formats
- **TypeScript Integration**: Full TypeScript support with declaration files
- **Exports Field**: Uses the new `exports` field for better module resolution
- **Package Entry Points**: Clear entry points for both ESM and CommonJS formats

### Module Configuration

The module is configured with the following settings in `package.json`:

```json
{
  "type": "module",
  "main": "./lib/cjs/index.js",
  "module": "./lib/esm/index.js",
  "types": "./lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "import": "./lib/esm/index.js",
      "require": "./lib/cjs/index.js"
    }
  }
}
```

### Build Process

The build process generates both ESM and CommonJS formats along with type definitions:

1. **ESM Build**:

   - Generates `.js` files for ES modules
   - Uses `tsconfig.json`
   - Output directory: `lib/esm/`

2. **CommonJS Build**:

   - Generates `.js` files for CommonJS modules
   - Uses `tsconfig.cjs.json`
   - Output directory: `lib/cjs/`

3. **Type Definitions**:
   - Generated alongside both builds
   - Located in `lib/types/`

### Distribution Files

When publishing to npm, only the following files are included:

- `lib/` directory containing:
  - ESM format (`.js` files in `lib/esm/`)
  - CommonJS format (`.js` files in `lib/cjs/`)
  - TypeScript declaration files (`.d.ts` in `lib/types/`)
  - Source maps (if enabled)

### Publishing

1. Update the version in `package.json`
2. Run `npm run build` to compile the latest changes
3. Run `npm publish` to publish to npm registry

## 🚀 Usage

### Installation

```bash
npm install
```

### Development

```bash
# Run linter
npm run lint

# Build
npm run build        # Build both ESM and CommonJS
npm run build:esm    # Build only ESM
npm run build:cjs    # Build only CommonJS

# Run tests
npm run test
npm run test:watch
```

### Module Usage

The library can be used in both ESM and CommonJS environments:

```javascript
// ESM
import { something } from 'module-template';

// CommonJS
const { something } = require('module-template');
```

### Build

Built files are generated in the `lib` directory:

- `lib/esm/index.js`: ESM format JavaScript file
- `lib/cjs/index.js`: CommonJS format JavaScript file
- `lib/types/index.d.ts`: TypeScript type definitions

## 📝 License

MIT
