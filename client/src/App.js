import React, { useState } from 'react';
import './App.css';
import Home from './components/Home';
import AddWordForm from './components/AddWordForm';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWordAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      {/* Background Elements */}
      <div className="floating-signs">
        <div className="sign">👋</div>
        <div className="sign">✌️</div>
        <div className="sign">🤟</div>
        <div className="sign">🤲</div>
      </div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="app-container">
        <header className="app-header">
          <h1>Sign Language Visual Dictionary</h1>
          <div className="header-decoration"></div>
        </header>
        <main className="app-main">
          <AddWordForm onWordAdded={handleWordAdded} />
          <Home key={refreshTrigger} />
        </main>
      </div>
    </div>
  );
}

export default App;
