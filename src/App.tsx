import React, {useState} from 'react';
import PaletteView from './PaletteView';
import { Palette, AnalogousPalette, MonochromaticPalette, TetradicPalette } from './Palette/Palettes';
import { RandomColor, HexColor } from './Palette/Color';
import { setURL } from './urlHandler';
import { RangeSlider } from './Components/RangeSlider';
import './App.css';
const queryString = require('query-string');

function App() {
  // Initialise from a url state
  let urlPalette = AnalogousPalette(RandomColor(), 0.3, 0.8, 0.5);
  let parsedURL = queryString.parse(window.location.search);
  if (parsedURL) {
    if (parsedURL.tl) {
      urlPalette.tl = HexColor(parsedURL.tl);
    }
    if (parsedURL.tr) {
      urlPalette.tr = HexColor(parsedURL.tr);
    }
    if (parsedURL.bl) {
      urlPalette.bl = HexColor(parsedURL.bl);
    }
    if (parsedURL.br) {
      urlPalette.br = HexColor(parsedURL.br);
    }
  }

  const [palette, setPaletteState] = useState(urlPalette);
  const [hueRange, setHueRange] = useState([0, 100]);
  const [satRange, setSatRange] = useState([0, 100]);
  const [lightRange, setLightRange] = useState([0, 100]);
  const [hueVariance, setHueVariance] = useState(15);
  const [satVariance, setSatVariance] = useState(50);
  const [lightVariance, setLightVariance] = useState(50);

  // ensure initial URL is valid
  setURL(palette);

  const setPalette = (p: Palette) => {
    setPaletteState(p);
    setURL(palette);
  }

  const newMonochromatic = () => {
    setPalette(MonochromaticPalette(RandomColor(), satVariance / 100, lightVariance / 100));
  }

  const newAnalogous = () => {
    setPalette(AnalogousPalette(RandomColor(), hueVariance / 100, satVariance / 100, lightVariance / 100));
  }

  const newTetradic = () => {
    setPalette(TetradicPalette(RandomColor(), hueVariance / 100, satVariance / 100, lightVariance / 100));
  }

  return (
    <div className="App">
      <header>
        <h1>
          <a href="/">palet<sup>teeny</sup></a>
        </h1>
      </header>
      <div className="App-body">
        <div className="Palette-window">
          <PaletteView palette={palette}/>
        </div>
        <span className="Palette-buttons">
          <button className="Palette-button" onClick={newMonochromatic}>Mono</button>
          <button className="Palette-button" onClick={newAnalogous}>Analogous</button>
          <button className="Palette-button" onClick={newTetradic}>Tetradic</button>
        </span>
        {/* <div className="RangeControl">
            <RangeSlider
                value={hueRange}
                onChange={(e, n) => setHueRange(n as number[])}
            />
            <RangeSlider
                value={hueVariance}
                onChange={(e, n) => setHueVariance(n as number)}
            />
            <RangeSlider
                value={satVariance}
                onChange={(e, n) => setSatVariance(n as number)}
            />
            <RangeSlider
                value={lightVariance}
                onChange={(e, n) => setLightVariance(n as number)}
            />
        </div> */}
      </div>
      <h2><a href="https://github.com/baronnobody">Developed by BaronNobody.</a></h2>
    </div>
  );
}

export default App;
