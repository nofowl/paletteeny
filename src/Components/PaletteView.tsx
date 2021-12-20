import React, {useEffect} from "react";
import {Palette} from '../Palette/Palettes'
import { PaletteRenderer } from '../Palette/PaletteRenderer'

interface Props {
    palette: Palette;
    paletteGL: PaletteRenderer;
}

const PaletteView = (props: Props) => {

    useEffect(() => {
        props.paletteGL.render(640, 640);
    }, [props.palette]);

    return (
        <>
            <canvas className="PaletteView" ref={props.paletteGL.canvasGLRef}/>
            <canvas className="TextView" ref={props.paletteGL.canvas2DRef}/>
        </>);
}

export default PaletteView;