import React, {useEffect} from "react";
import {Palette} from './Palette/Palettes'
import { PaletteGL } from './PaletteGL'

interface Props {
    palette: Palette;
    paletteGL: PaletteGL;
}

const PaletteView = (props: Props) => {

    useEffect(() => {
        props.paletteGL.render(640, 640);
    });

    return <canvas className="PaletteView" ref={props.paletteGL.canvasRef}/>
}

export default PaletteView;