import React, {useCallback, useEffect, useMemo, useState} from 'react';

import PaletteView from './Components/PaletteView';
import { Palette, AnalogousPalette } from './Palette/Palettes';
import { RandomColor, HexColor } from './Palette/Color';
import { shareStringForPalette, shareUrlForPalette, SHARE_TEXT, SHARE_TITLE } from './urlHandler';
import { Snackbar, SnackbarOrigin } from '@mui/material';
import './App.css';
import ExportPopup from './Components/ExportPopup';
import PaletteButtons from './Components/PaletteButtons'
import ColorButtons from './Components/ColorButtons';
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

  const hideSnack = useCallback(() => {
    setSnackOpen(false);
  }, []);

  const handleShare = async () => {
    if (!!window.navigator.share) {
      const response = await fetch(imageData);
      const blob = await response.blob();
      const data = {
        files: [ new File([blob], 'palette.png', {type:blob.type}) ],
        title: SHARE_TITLE,
        text: SHARE_TEXT,
        url: shareUrlForPalette(palette)
      };

      try {
        if (!navigator.canShare(data)) {
          console.error("Failed to share data.");
        }
        await navigator.share(data);
      } catch (err) {
        console.error(err);
      }
    } else {
      // Else, just do the copy
      navigator.clipboard.writeText(shareStringForPalette(palette));
      setSnackMessage('Link copied to clipboard.');
      setSnackOpen(true);
    }
  };

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
        onShare={handleShare}
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
          <ColorButtons palette={palette} changePalette={setNewPaletteState}/>
          <PaletteButtons setPalette={setNewPaletteState} lastPalette={lastPalette}/>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
