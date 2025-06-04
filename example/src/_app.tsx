import { BottomFixed } from 'react-bottom-fixed';
import './styles/reset.css';
import styles from './styles/index.module.scss';
import { useState } from 'react';

const LONG_CONTENT_KEY = 'cta-long-content';

function App() {
  const [isLongContent, setIsLongContent] = useState(
    localStorage.getItem(LONG_CONTENT_KEY) === 'true',
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Fixed CTA Button</h1>
      <p className={styles.description}>
        This is a simple example of a fixed CTA button that is positioned above
        the keyboard on mobile devices.
      </p>

      <button
        type="button"
        className={styles.link}
        onClick={() => {
          localStorage.setItem(LONG_CONTENT_KEY, String(!isLongContent));
          setIsLongContent(!isLongContent);
        }}
      >
        Toggle long content
      </button>

      <input type="text" className={styles.input} />

      {isLongContent && (
        <div className={styles.long_content}>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            <br />
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </p>
        </div>
      )}

      <BottomFixed className={styles.cta}>
        <button
          type="button"
          className={styles.button}
          onClick={() => alert('submit')}
        >
          Submit
        </button>
      </BottomFixed>
    </div>
  );
}

export default App;
