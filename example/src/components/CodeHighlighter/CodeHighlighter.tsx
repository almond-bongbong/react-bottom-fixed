import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import styles from './CodeHighlighter.module.css';

interface Props {
  children: string;
  language?: string;
}

function CodeHighlighter({ children, language = 'jsx' }: Props) {
  return (
    <Highlight language={language} code={children} theme={themes.github}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre style={style} className={styles.code}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

export default CodeHighlighter;
