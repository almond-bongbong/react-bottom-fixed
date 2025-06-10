import { BottomFixed } from 'react-bottom-fixed';
import './styles/reset.css';
import styles from './styles/index.module.scss';
import { useEffect, useState } from 'react';

const LONG_CONTENT_KEY = 'cta-long-content';

function App() {
  const [isLongContent, setIsLongContent] = useState(
    localStorage.getItem(LONG_CONTENT_KEY) === 'true',
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Smart Mobile CTA Button</h1>
      <p className={styles.description}>
        Transform your mobile user experience with our open-source CTA button
        library. Perfect for e-commerce, lead generation, and conversion
        optimization.
      </p>

      <button
        type="button"
        className={styles.link}
        onClick={() => {
          localStorage.setItem(LONG_CONTENT_KEY, String(!isLongContent));
          setIsLongContent(!isLongContent);
        }}
      >
        View Features
      </button>

      <input
        type="text"
        className={styles.input}
        placeholder="Search documentation..."
        onFocus={(e) => {
          setTimeout(() => {
            e.target.blur();
          }, 1500);
        }}
      />

      {isLongContent && (
        <div className={styles.long_content}>
          <p>
            Elevate your mobile web applications with our open-source CTA button
            library. Designed specifically for React developers, this library
            ensures your call-to-action buttons are always visible and
            accessible, even when the mobile keyboard is active.
            <br />
            <br />
            Key Features: • Automatic keyboard detection and positioning •
            Smooth animations and transitions • Customizable styling and themes
            • Lightweight and performance-optimized • TypeScript support •
            Cross-browser compatibility
            <br />
            <br />
            Perfect for: • E-commerce checkout flows • Lead generation forms •
            Subscription sign-ups • Mobile-first applications • Progressive Web
            Apps
            <br />
            <br />
            Join our growing community of developers who have enhanced their
            mobile user experience with our library. Our comprehensive
            documentation and active community support make implementation a
            breeze.
            <br />
            <br />
            Star us on GitHub and contribute to make this library even better!
            We welcome bug reports, feature requests, and pull requests from the
            community.
          </p>
        </div>
      )}

      <div className={styles.cta}>
        <button
          type="button"
          className={styles.button}
          onClick={() => alert('View on GitHub')}
        >
          View on GitHub
        </button>
      </div>
    </div>
  );
}

export default App;
