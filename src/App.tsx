import React, {useEffect, useRef, useState} from 'react';
import PaletteView from './PaletteView';
import { PaletteGL } from './PaletteGL';
import { Palette, AnalogousPalette, MonochromaticPalette, TetradicPalette } from './Palette/Palettes';
import { RandomColor, HexColor } from './Palette/Color';
import { setURL, shareUrlForPalette } from './urlHandler';
import { RangeSlider } from './Components/RangeSlider';
import { ReactComponent as ExportIcon } from './icons/export.svg'
import { ReactComponent as LinkIcon } from './icons/link.svg'
import { Snackbar } from '@mui/material';
import { TooltipButton } from './Components/TooltipButton';
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

  // initialise state
  const [palette, setPaletteState] = useState(urlPalette);
  const [hueRange, setHueRange] = useState([0, 100]);
  const [satRange, setSatRange] = useState([0, 100]);
  const [lightRange, setLightRange] = useState([0, 100]);
  const [hueVariance, setHueVariance] = useState(15);
  const [satVariance, setSatVariance] = useState(50);
  const [lightVariance, setLightVariance] = useState(50);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  // construct the refs for rendering the gl view
  let canvasRef = useRef<HTMLCanvasElement | null>(null);
  let canvasContext = useRef<WebGLRenderingContext | null>(null);

  let paletteGL = new PaletteGL(canvasRef, canvasContext, palette);

  // ensure initial URL is valid

  useEffect(() => {
    setURL(palette);
  }, [palette]);

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

  const showSnack = (msg : string) => {
    setSnackMessage(msg);
    setSnackOpen(true);
  }

  const hideSnack = () => {
    setSnackOpen(false);
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrlForPalette(palette));
    showSnack('Link copied to clipboard.');
  }

  const exportCanvas = () => {
    paletteGL.saveImage(640, 640);
  }

  return (
    <div className="App">
    <div className="App-header">
      <TooltipButton className="Export-button Tooltip" tooltip="Share" onClick={copyLink}><LinkIcon/></TooltipButton>
      <h1><a href="/">palet<sup>teeny</sup></a></h1>
      <TooltipButton className="Export-button Tooltip" tooltip="Export" onClick={exportCanvas}><ExportIcon/></TooltipButton>
    </div>
      <div className="App-body">
        <div className="Palette-window">
          <PaletteView palette={palette} paletteGL={paletteGL}/>
          <Snackbar
            anchorOrigin={{vertical:'bottom', horizontal:'center'}}
            open={snackOpen}
            autoHideDuration={1000}
            onClose={hideSnack}
            message={snackMessage}
          />
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
