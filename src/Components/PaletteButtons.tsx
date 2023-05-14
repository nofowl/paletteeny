import React, { useCallback } from 'react';
import { Palette, AnalogousPalette, MonochromaticPalette, TetradicPalette } from '../Palette/Palettes';
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
const hueVariance = 15;
const satVariance = 50;
const lightVariance = 50;

export default function PaletteButtons({ setPalette, lastPalette }: Props) {

    const newMonochromatic = useCallback(() => {
        setPalette(MonochromaticPalette(RandomColor(), satVariance / 100, lightVariance / 100));
    }, [setPalette]);

    const newAnalogous = useCallback(() => {
        setPalette(AnalogousPalette(RandomColor(), hueVariance / 100, satVariance / 100, lightVariance / 100));
    }, [setPalette]);

    const newTetradic = useCallback(() => {
        setPalette(TetradicPalette(RandomColor(), hueVariance / 100, satVariance / 100, lightVariance / 100))
    }, [setPalette]);

    const setLastPalette = useCallback(() => {
        setPalette(lastPalette);
    }, [setPalette, lastPalette]);

  return (
    <span className="Palette-buttons">
        <TooltipButton className="TooltipButton Tooltip" tooltip="Mono" onClick={newMonochromatic}><MonoIcon/></TooltipButton>
        <TooltipButton className="TooltipButton Tooltip" disabled tooltip="Symmetric"><SymmetricIcon/></TooltipButton>
        <TooltipButton className="TooltipButton Tooltip" tooltip="Analogous" onClick={newAnalogous}><AnalogousIcon/></TooltipButton>
        <TooltipButton className="TooltipButton Tooltip" disabled tooltip="Triadic"><TriadicIcon/></TooltipButton>
        <TooltipButton className="TooltipButton Tooltip" tooltip="Tetradic" onClick={newTetradic}><TetradicIcon/></TooltipButton>
        <TooltipButton className="TooltipButton Tooltip" disabled tooltip="Square"><SquareIcon/></TooltipButton>
        <TooltipButton className="TooltipButton Tooltip" tooltip="Previous" onClick={setLastPalette}><PreviousIcon/></TooltipButton>
    </span>
  );
};