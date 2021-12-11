import React from 'react';
import './App.css';
import PaletteWindow from './PaletteWindow';
import Palette from './Palette'

function App() {
  
  const palette = new Palette();

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Hello
        </p>
        <PaletteWindow palette={palette}/>
      </header>
    </div>
  );
}

export default App;
