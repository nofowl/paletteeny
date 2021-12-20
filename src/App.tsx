import React, {useEffect, useRef, useState} from 'react';

import PaletteView from './Components/PaletteView';
import { PaletteRenderer } from './Palette/PaletteRenderer';
import { Palette, AnalogousPalette, MonochromaticPalette, TetradicPalette } from './Palette/Palettes';
import { RandomColor, HexColor } from './Palette/Color';
import { shareStringForPalette, shareUrlForPalette, SHARE_TEXT, SHARE_TITLE } from './urlHandler';
import { RangeSlider } from './Components/RangeSlider';

import { Snackbar, SnackbarOrigin } from '@mui/material';
import './App.css';
import ExportPopup from './Components/ExportPopup';
import Footer from './Components/Footer';
import Header from './Components/Header';
const queryString = require('query-string');

const SNACKBAR_ORIGIN: SnackbarOrigin = {vertical:'bottom', horizontal:'center'};

function App() {
  // initialise state
  const [palette, setPaletteState] = useState(AnalogousPalette(RandomColor(), 0.3, 0.8, 0.5));
  const [hueRange, setHueRange] = useState([0, 100]);
  const [satRange, setSatRange] = useState([0, 100]);
  const [lightRange, setLightRange] = useState([0, 100]);
  const [hueVariance, setHueVariance] = useState(15);
  const [satVariance, setSatVariance] = useState(50);
  const [lightVariance, setLightVariance] = useState(50);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  // Initialise from a url state
  useEffect(() => {
    const urlPalette = AnalogousPalette(RandomColor(), 0.3, 0.8, 0.5);
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
      setPaletteState(urlPalette);
    }
  }, []);

  // must be constructed in a react component.
  const canvasGLRef = useRef<HTMLCanvasElement | null>(null);
  const canvasGLContext = useRef<WebGLRenderingContext | null>(null);
  const canvas2DRef = useRef<HTMLCanvasElement | null>(null);
  const canvas2DContext = useRef<CanvasRenderingContext2D | null>(null);

  const paletteGL = new PaletteRenderer(
    canvasGLRef,
    canvasGLContext,
    canvas2DRef,
    canvas2DContext,
    palette);

  // ensure changed URL is clean
  useEffect(() => {
    window.history.replaceState({}, "", "/");
  }, [palette]);

  const setPalette = (p: Palette) => {
    setPaletteState(p);
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
    navigator.clipboard.writeText(shareStringForPalette(palette));
    showSnack('Link copied to clipboard.');
  }

  const share = () => {
    if (!!window.navigator.share) {
      // If we have native share functionality, use that
      window.navigator.share({
        title: SHARE_TITLE,
        text: SHARE_TEXT,
        url: shareUrlForPalette(palette),
      });
    } else {
      // Else, just do the copy
      copyLink();
    }
  }

  const exportCanvas = () => {
    setImageSrc(paletteGL.saveImage(640, 640));
    setShowExport(true);
  }

  const hideExport = () => {
    setShowExport(false);
  }

  return (
    <>
      <ExportPopup show={showExport} onClose={hideExport} imageSrc={imageSrc}/>
      <div className="App">
      <Header
        onShare={share}
        onExportCanvas={exportCanvas}
      />
        <div className="App-body">
          <div className="Palette-window">
            <PaletteView palette={palette} paletteGL={paletteGL}/>
            <Snackbar
              anchorOrigin={SNACKBAR_ORIGIN}
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
        <Footer />
      </div>
    </>
  );
}

export default App;
