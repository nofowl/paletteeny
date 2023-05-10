import { isError } from "../error-helper";
import { Palette } from "./Palettes";
import { renderGL, renderText } from "./Renderer";

function createHiddenCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function getGLContext(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('webgl', { preserveDrawingBuffer: true });

  if (ctx === null) {
    throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
  }

  return ctx;
}

export function get2DContext(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');

  if (ctx === null) {
    throw new Error("Unable to initialize text canvas.");
  }

  return ctx;
}

export function createDataCanvases(width: number, height: number): [HTMLCanvasElement, WebGLRenderingContext, HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvasGL = createHiddenCanvas(width, height);
  const ctxGL = getGLContext(canvasGL);
  const canvas2D = createHiddenCanvas(width, height);
  const ctx2D =  get2DContext(canvas2D);

  return [canvasGL, ctxGL, canvas2D, ctx2D];
}

export function getImageData(width: number, height: number, palette: Palette) : string {
  let canvasGL: HTMLCanvasElement;
  let ctxGL: WebGLRenderingContext;
  let canvas2D: HTMLCanvasElement;
  let ctx2D: CanvasRenderingContext2D;
  try {
    [canvasGL, ctxGL, canvas2D, ctx2D] = createDataCanvases(width, height);
  } catch (error) {
    if (isError(error)) {
      alert(error.message);
    } else {
      alert(error);
    }
    return "";
  }

  renderGL(ctxGL, width, height, palette);

  ctx2D.clearRect(0, 0, width, height);
  ctx2D.drawImage(canvasGL, 0, 0);
  renderText(ctx2D, width, height, palette);

  return canvas2D.toDataURL("image/png");
}