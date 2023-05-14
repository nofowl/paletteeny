import React, { useCallback } from 'react';
import { Palette } from '../Palette/Palettes';
import ColorButton from './ColorButton'
import Color from '../Palette/Color';

type Props = {
  palette: Palette,
  changePalette : (p: Palette) => void,
};

export default function ColorButtons({ palette, changePalette }: Props) {

  const changeColorTL = useCallback((col: Color) => {
    let p = {} as Palette;
    p.tl = col;
    p.tr = palette.tr;
    p.bl = palette.bl;
    p.br = palette.br;

    changePalette(p);
  }, [palette, changePalette]);

  const changeColorTR = useCallback((col: Color) => {
    let p = {} as Palette;
    p.tr = col;
    p.tl = palette.tl;
    p.bl = palette.bl;
    p.br = palette.br;

    changePalette(p);
  }, [palette, changePalette]);

  const changeColorBL = useCallback((col: Color) => {
    let p = {} as Palette;
    p.bl = col;
    p.tr = palette.tr;
    p.tl = palette.tl;
    p.br = palette.br;

    changePalette(p);
  }, [palette, changePalette]);

  const changeColorBR = useCallback((col: Color) => {
    let p = {} as Palette;
    p.br = col;
    p.tr = palette.tr;
    p.bl = palette.bl;
    p.tl = palette.tl;

    changePalette(p);
  }, [palette, changePalette]);

  return (
    <div className="ColorButtons">
        <ColorButton className="tl" color={palette.tl} onChange={changeColorTL}/>
        <ColorButton color={palette.tr} onChange={changeColorTR}/>
        <ColorButton color={palette.br} onChange={changeColorBR}/>
        <ColorButton className="bl" color={palette.bl} onChange={changeColorBL}/>
    </div>
  );
};