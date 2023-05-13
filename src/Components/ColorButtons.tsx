import React from 'react';
import { Palette } from '../Palette/Palettes';
import ColorButton from './ColorButton'

type Props = {
  palette: Palette;
};

export default function Header({ palette }: Props) {

  return (
    <div className="ColorButtons">
        <ColorButton className="tl" color={palette.tl}/>
        <ColorButton color={palette.tr}/>
        <ColorButton color={palette.br}/>
        <ColorButton className="bl" color={palette.bl}/>
    </div>
  );
};