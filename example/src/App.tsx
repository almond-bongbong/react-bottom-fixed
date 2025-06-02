import { Component } from 'module-template';
import CodeHighlighter from './components/CodeHighlighter';

function App() {
  return (
    <div className="App">
      <Component />

      <CodeHighlighter>{`<Component />`}</CodeHighlighter>
    </div>
  );
}

export default App;
