import { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import TrumpImg from './assets/images/TrumpIMg.png';
import LatexAssistant from './LatexAssistant';

function App() {
  return (
    <div className="app-container">
    

      <main className="app-main">
        <Dashboard />
      </main>

    
    </div>
  );
}

export default App;
