import React, {useState} from 'react';
import './App.css';
import PaletteWindow from './PaletteWindow';
import { MonochromaticPalette } from './Palette/Palettes';
import { RandomColor, HexColor } from './Palette/Color';
import Palette from './Palette/Palette';
import { setURL } from './urlHandler';
const queryString = require('query-string');

function App() {
  // Initialise from a url state
  let urlPalette = new Palette();
  let parsedURL = queryString.parse(window.location.search);
  if (parsedURL)
  {
    if (parsedURL.tl) {
      urlPalette.colorTL = HexColor(parsedURL.tl);
    }
    if (parsedURL.tr) {
      urlPalette.colorTR = HexColor(parsedURL.tr);
    }
    if (parsedURL.bl) {
      urlPalette.colorBL = HexColor(parsedURL.bl);
    }
    if (parsedURL.br) {
      urlPalette.colorBR = HexColor(parsedURL.br);
    }
  }

  const [palette, setPaletteState] = useState(urlPalette);

  // ensure initial URL is valid
  setURL(palette);

  const setPalette = (p: Palette) => {
    setPaletteState(p);
    setURL(palette);
  }

  const newMonochromatic = () => {
    setPalette(MonochromaticPalette(RandomColor(), 0.8, 0.4));
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <a href="/">palet<sup>teeny</sup></a>
        </h1>
        <PaletteWindow palette={palette}/>
        <span>
          <button onClick={newMonochromatic}>Mono</button>
          <button onClick={newMonochromatic}>Complimentary</button>
          <button onClick={newMonochromatic}>Triadic</button>
        </span>
      </header>
    </div>
  );
}

export default App;
