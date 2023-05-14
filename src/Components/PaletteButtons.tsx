import React from 'react';
import { Palette, AnalogousPalette, MonochromaticPalette, TriadicPalette, TetradicPalette, SquarePalette, SymmetricPalette } from '../Palette/Palettes';
import { RandomColor } from '../Palette/Color';
import TooltipButton from './TooltipButton'

import { ReactComponent as MonoIcon } from '../icons/Mono.svg';
import { ReactComponent as AnalogousIcon } from '../icons/Analogous.svg';
import { ReactComponent as SymmetricIcon } from '../icons/Symmetrical.svg';
import { ReactComponent as TriadicIcon } from '../icons/Triadic.svg';
import { ReactComponent as TetradicIcon } from '../icons/Tetradic.svg';
import { ReactComponent as SquareIcon } from '../icons/Square.svg';
import { ReactComponent as PreviousIcon } from '../icons/Previous.svg';

type Props = {
  setPalette: (p: Palette) => void,
  lastPalette: Palette,
};

// To be replaced with configurable values soon
const hueVariance = 0.05;
const satVariance = 0.40;
const lightVariance = 0.40;

export default function PaletteButtons({ setPalette, lastPalette }: Props) {
  return (
    <span className="Palette-buttons">
        <TooltipButton className="TooltipButton Tooltip" tooltip="Mono" onClick={e=>setPalette(MonochromaticPalette(RandomColor(), satVariance, lightVariance))}><MonoIcon/></TooltipButton>
        <TooltipButton className="TooltipButton Tooltip" tooltip="Symmetric" onClick={e=>setPalette(SymmetricPalette(RandomColor(), hueVariance, satVariance, lightVariance))}><SymmetricIcon/></TooltipButton>
        <TooltipButton className="TooltipButton Tooltip" tooltip="Analogous" onClick={e=>setPalette(AnalogousPalette(RandomColor(), 0.2, satVariance, lightVariance))}><AnalogousIcon/></TooltipButton>
        <TooltipButton className="TooltipButton Tooltip" tooltip="Triadic" onClick={e=>setPalette(TriadicPalette(RandomColor(), hueVariance, satVariance, lightVariance))}><TriadicIcon/></TooltipButton>
        <TooltipButton className="TooltipButton Tooltip" tooltip="Tetradic" onClick={e=>setPalette(TetradicPalette(RandomColor(), hueVariance, satVariance, lightVariance))}><TetradicIcon/></TooltipButton>
        <TooltipButton className="TooltipButton Tooltip" tooltip="Square" onClick={e=>setPalette(SquarePalette(RandomColor(), hueVariance, satVariance, lightVariance))}><SquareIcon/></TooltipButton>
        <TooltipButton className="TooltipButton Tooltip" tooltip="Previous" onClick={e=>setPalette(lastPalette)}><PreviousIcon/></TooltipButton>
    </span>
  );
};