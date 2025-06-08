# 🔧 react-bottom-fixed

[![NPM](https://img.shields.io/npm/v/react-bottom-fixed.svg)](https://www.npmjs.com/package/react-bottom-fixed)
![License](https://img.shields.io/npm/l/react-confetti-boom)
![Size](https://img.shields.io/bundlephobia/min/react-confetti-boom)
![NPM Downloads](https://img.shields.io/npm/dw/react-bottom-fixed.svg)
[![Deploy to GitHub Pages](https://github.com/almond-bongbong/react-bottom-fixed/actions/workflows/deploy_to_github_pages.yml/badge.svg)](https://github.com/almond-bongbong/react-bottom-fixed/actions/workflows/deploy_to_github_pages.yml)

> A smart React component that keeps your bottom buttons visible even when the iOS keyboard appears

<p align="center">
    <a target="_blank" href="https://almond-bongbong.github.io/react-bottom-fixed/">
        <img src="https://github.com/almond-bongbong/react-bottom-fixed/raw/main/example/fixed_preview.gif" width="300px" />
    </a>
</p>

## Why does this exist? 🤔

If you've ever built mobile web apps, you've probably experienced this frustration:

- **Buttons disappear behind the keyboard on iPhone** 😭
- CSS `position: fixed` doesn't work properly on iOS Safari/Chrome
- Important action buttons get hidden every time users start typing

This library solves exactly that problem! While Android fixed this issue back in 2019, iOS still hasn't caught up.

## How does it work? ✨

It **automatically adjusts** your button position in real-time whenever the keyboard appears:

- Uses the `visualViewport` API to calculate exact keyboard height
- Smoothly moves buttons up using `transform` (no reflow!)
- Fades buttons slightly during scrolling to avoid blocking content

## Installation 📦

```bash
npm install react-bottom-fixed
```

## Usage 🚀

Super simple! Just wrap your bottom button with `BottomFixed` and you're done:

```tsx
import { BottomFixed } from 'react-bottom-fixed';

function MyApp() {
  return (
    <div>
      {/* Regular page content */}
      <h1>Hello World!</h1>
      <input type="text" placeholder="Try typing here" />

      {/* Button that stays visible above keyboard */}
      <BottomFixed>
        <button onClick={() => alert('Done!')}>Complete</button>
      </BottomFixed>
    </div>
  );
}
```

### Custom styling? ✨

```tsx
<BottomFixed className="my-custom-style">
  <button className="fancy-button">Fancy Button</button>
</BottomFixed>
```

## API Reference 📚

### `BottomFixed` Props

| Property    | Type        | Required | Description                     |
| ----------- | ----------- | -------- | ------------------------------- |
| `children`  | `ReactNode` | ✅       | Component to be fixed at bottom |
| `className` | `string`    | ❌       | Additional CSS class name       |

## Browser Support 🌐

- ✅ **iOS Safari** (main target!)
- ✅ **iOS Chrome**
- ✅ **Android browsers** (works great already, but compatibility guaranteed)
- ✅ **Desktop** (works as regular container)

On non-iOS environments, it automatically behaves like a normal container with zero performance overhead.

## Try the Demo 👀

**🌐 [Live Demo](https://almond-bongbong.github.io/react-bottom-fixed/)** - Try it right now!

Or clone and run locally:

```bash
git clone https://github.com/almond-bongbong/react-bottom-fixed.git
cd react-bottom-fixed/example
npm install
npm run dev
```

Test it on iPhone or Chrome DevTools mobile mode – you'll see the difference immediately!

## Important Notes ⚠️

- **iOS-only optimization**: No extra logic runs on non-iOS devices
- **Requires `visualViewport`**: Gracefully falls back to regular container on older browsers
- **Performance-first**: Built with GPU acceleration for smooth animations

## Contributing 🤝

Found a bug or have ideas for improvement? We'd love to hear from you!

- 🐛 [Report bugs](https://github.com/almond-bongbong/react-bottom-fixed/issues)
- 💡 [Request features](https://github.com/almond-bongbong/react-bottom-fixed/issues)

## License 📄

MIT License - feel free to use it however you like!

---

<div align="center">
  <sub>Made with ❤️ for better mobile web experience</sub>
</div>
