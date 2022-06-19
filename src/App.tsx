import React, {useCallback, useEffect, useMemo, useState} from 'react';

import PaletteView from './Components/PaletteView';
import { AnalogousPalette, MonochromaticPalette, TetradicPalette } from './Palette/Palettes';
import { RandomColor, HexColor } from './Palette/Color';
import { shareStringForPalette, shareUrlForPalette, SHARE_TEXT, SHARE_TITLE } from './urlHandler';
import { RangeSlider } from './Components/RangeSlider';

import { Snackbar, SnackbarOrigin } from '@mui/material';
import './App.css';
import ExportPopup from './Components/ExportPopup';
import Footer from './Components/Footer';
import Header from './Components/Header';
import { getImageData } from './Palette/CanvasHelper';
const queryString = require('query-string');

const SNACKBAR_ORIGIN: SnackbarOrigin = {
  vertical:'bottom',
  horizontal:'center'
};

const RENDER_WIDTH = 640;
const RENDER_HEIGHT = 640;

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

  // ensure changed URL is clean
  useEffect(() => {
    window.history.replaceState({}, "", "/");
  }, [palette]);

  const newMonochromatic = useCallback(() => {
    setPaletteState(MonochromaticPalette(RandomColor(), satVariance / 100, lightVariance / 100));
  }, [satVariance, lightVariance]);

  const newAnalogous = useCallback(() => {
    setPaletteState(AnalogousPalette(RandomColor(), hueVariance / 100, satVariance / 100, lightVariance / 100));
  }, [hueVariance, satVariance, lightVariance]);

  const newTetradic = useCallback(() => {
    setPaletteState(TetradicPalette(RandomColor(), hueVariance / 100, satVariance / 100, lightVariance / 100))
  }, [hueVariance, satVariance, lightVariance]);

  const hideSnack = useCallback(() => {
    setSnackOpen(false);
  }, [])

  const share = useCallback(() => {
    if (!!window.navigator.share) {
      // If we have native share functionality, use that
      window.navigator.share({
        title: SHARE_TITLE,
        text: SHARE_TEXT,
        url: shareUrlForPalette(palette),
      });
    } else {
      // Else, just do the copy
      navigator.clipboard.writeText(shareStringForPalette(palette));
      setSnackMessage('Link copied to clipboard.');
      setSnackOpen(true);
    }
  }, [palette]);

  const imageData = useMemo(() => getImageData(RENDER_WIDTH, RENDER_HEIGHT, palette), [palette]);

  const exportCanvas = useCallback(() => {
    setImageSrc(imageData);
    setShowExport(true);
  }, [imageData]);

  const hideExport = useCallback(() => setShowExport(false), []);

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
            <PaletteView palette={palette} width={RENDER_WIDTH} height={RENDER_HEIGHT}/>
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
