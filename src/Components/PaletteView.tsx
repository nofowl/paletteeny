import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isError } from "../error-helper";
import { getGLContext } from "../Palette/CanvasHelper";
import { Palette } from '../Palette/Palettes'
import { renderGL } from "../Palette/Renderer";

interface Props {
  palette: Palette;
  width: number;
  height: number;
}

export default function PaletteView({ palette, width, height }: Props) {
  // Use useCallback and useState as useRef doesn't play too well with memoization
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const canvasGL = useCallback((node: HTMLCanvasElement | null) => {
    if (node !== null) {
      setCanvas(node);
    }
  }, []);

  const ctxGL = useMemo(() => {
    if (!canvas) return null;

    try {
      return getGLContext(canvas);
    } catch (error) {
      if (isError(error)) {
        alert(error.message);
      } else {
        alert(error);
      }
    }
  }, [canvas]);

  useEffect(() => {
    if (ctxGL) {
      renderGL(ctxGL, width, height, palette);
    }
  }, [palette, ctxGL, width, height]);
  
  return (
    <>
      <canvas className="PaletteView" height={height} width={width} ref={canvasGL}/>
    </>
  );
}