import React from 'react';
import MealManager from './components/MealManager';
import './App.css';

function App() {
  return (
    <div className="App" style={{maxWidth:900, margin:'0 auto', padding:20}}>
      <h1>Meal Planner</h1>
      <MealManager />
    </div>
  );
}

export default App;