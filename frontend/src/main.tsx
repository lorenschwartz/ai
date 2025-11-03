import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI-MI</h1>
        <p>Welcome to AI-MI</p>
      </header>
    </div>
  );
}