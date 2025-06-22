import {
  BottomFixed,
  ScrollBehavior,
  ScrollBehaviorType,
} from 'react-bottom-fixed';
import './styles/reset.css';
import styles from './styles/index.module.scss';
import { useState } from 'react';

const LONG_CONTENT_KEY = 'cta-long-content';

function App() {
  const [isLongContent, setIsLongContent] = useState(
    localStorage.getItem(LONG_CONTENT_KEY) === 'true',
  );

  const [scrollBehavior, setScrollBehavior] = useState<ScrollBehaviorType>(
    ScrollBehavior.FADE_OUT,
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Smart Mobile CTA Button</h1>

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
      />

      <div className={styles.scroll_behavior_container}>
        <h3 className={styles.subtitle}>Scroll Behavior Settings</h3>
        <div className={styles.radio_group}>
          <label
            className={`${styles.radio_label} ${scrollBehavior === ScrollBehavior.FADE_OUT ? styles.selected : ''}`}
          >
            <input
              type="radio"
              name="scrollBehavior"
              value="fade-out"
              checked={scrollBehavior === ScrollBehavior.FADE_OUT}
              onChange={(e) =>
                setScrollBehavior(e.target.value as ScrollBehaviorType)
              }
            />
            <span>fade-out</span>
          </label>
          <label
            className={`${styles.radio_label} ${scrollBehavior === ScrollBehavior.CLOSE_KEYBOARD ? styles.selected : ''}`}
          >
            <input
              type="radio"
              name="scrollBehavior"
              value="close-keyboard"
              checked={scrollBehavior === ScrollBehavior.CLOSE_KEYBOARD}
              onChange={(e) =>
                setScrollBehavior(e.target.value as ScrollBehaviorType)
              }
            />
            <span>close-keyboard</span>
          </label>
        </div>
      </div>

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

      <BottomFixed className={styles.cta} scrollBehavior={scrollBehavior}>
        <button
          type="button"
          className={styles.button}
          onClick={() => alert('View on GitHub')}
        >
          View on GitHub
        </button>
      </BottomFixed>
    </div>
  );
}

export default App;
