import React, {useCallback, useEffect, useMemo, useState} from 'react';

import PaletteView from './Components/PaletteView';
import { Palette, CopiedPalette, AnalogousPalette, MonochromaticPalette, TetradicPalette } from './Palette/Palettes';
import { RandomColor, HexColor, IsHexColor } from './Palette/Color';
import { shareStringForPalette, shareUrlForPalette, SHARE_TEXT, SHARE_TITLE } from './urlHandler';
import { BlockPicker } from 'react-color';
import { Snackbar, SnackbarOrigin } from '@mui/material';
import './App.css';
import ExportPopup from './Components/ExportPopup';
import TooltipButton from './Components/TooltipButton';
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

// To be replaced with configurable values soon
const hueVariance = 15;
const satVariance = 50;
const lightVariance = 50;

function App() {
  // initialise state
  const [palette, setPaletteState] = useState(AnalogousPalette(RandomColor(), 0.3, 0.8, 0.5));
  const [lastPalette, setLastPaletteState] = useState(palette);
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
      setLastPaletteState(urlPalette);
    }
  }, []);

  // ensure changed URL is clean
  useEffect(() => {
    window.history.replaceState({}, "", "/");
  }, [palette]);

  const setNewPaletteState = useCallback((p : Palette) => {
    setLastPaletteState(palette);
    setPaletteState(p);
  }, [palette]);

  const newMonochromatic = useCallback(() => {
    setNewPaletteState(MonochromaticPalette(RandomColor(), satVariance / 100, lightVariance / 100));
  }, [setNewPaletteState]);

  const newAnalogous = useCallback(() => {
    setNewPaletteState(AnalogousPalette(RandomColor(), hueVariance / 100, satVariance / 100, lightVariance / 100));
  }, [setNewPaletteState]);

  const newTetradic = useCallback(() => {
    setNewPaletteState(TetradicPalette(RandomColor(), hueVariance / 100, satVariance / 100, lightVariance / 100))
  }, [setNewPaletteState]);

  const setLastPalette = useCallback(() => {
    setNewPaletteState(lastPalette);
  }, [setNewPaletteState, lastPalette]);

  const hideSnack = useCallback(() => {
    setSnackOpen(false);
  }, []);

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

  const setTlColor = useCallback((value : string) => {
    if (IsHexColor(value)) {
      const newPalette = CopiedPalette(palette);
      newPalette.tl = HexColor(value);
      setNewPaletteState(newPalette);
    }
  }, [setNewPaletteState, palette]);

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
            { false ? <BlockPicker color={"#"+palette.tl.asHex()} onChange={(c) => setTlColor(c.hex)}/> : null}
            <Snackbar
              anchorOrigin={SNACKBAR_ORIGIN}
              open={snackOpen}
              autoHideDuration={1000}
              onClose={hideSnack}
              message={snackMessage}
            />
          </div>
          <span className="Palette-buttons">
            <TooltipButton className="TooltipButton Tooltip" tooltip="Mono" onClick={newMonochromatic}/>
            <TooltipButton className="TooltipButton Tooltip" tooltip="Analogous" onClick={newAnalogous}/>
            <TooltipButton className="TooltipButton Tooltip" tooltip="Tetradic" onClick={newTetradic}/>
            <TooltipButton className="TooltipButton Tooltip" tooltip="Previous" onClick={setLastPalette}/>
          </span>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
