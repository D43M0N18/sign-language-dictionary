import React from 'react';
import './App.css';
import Home from './components/Home';
import AddWordForm from './components/AddWordForm';

function App() {
  return (
    <div className="App">
      <h1>Mini Sign Language Visual Dictionary</h1>
      <AddWordForm />
      <Home />
    </div>
  );
}

export default App;
