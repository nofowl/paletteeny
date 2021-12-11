import React from 'react';
import './App.css';
import PaletteWindow from './PaletteWindow';
import { MonochromaticPalette } from './Palette/Palettes';
import Color, { RandomColor } from './Palette/Color';

function App() {

  const palette = MonochromaticPalette(RandomColor(), 0.8, 0.4);

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
