import { debug } from "console";
import Color from "./Color";
import Palette from "./Palette";

function randomRange(min: number, max: number) : number {
    return min + (max - min) * Math.random();
}

function colorFrom(
    color : Color,
    hueRange: number = 1,
    satRange: number = 1,
    lightRange: number = 1)
    : Color
{
    let c = new Color();

    let hue = color.hue();
    let sat = color.saturation();
    let light = color.lightness();

    let minHue = hue - (hue * hueRange), maxHue = hue + (360 - hue) * hueRange;
    let minSat = sat - (sat * satRange), maxSat = sat + (1 - sat) * satRange;
    let minLight = light - (light * lightRange), maxLight = light + (1 - light) * lightRange;

    hue = randomRange(minHue, maxHue);
    sat = randomRange(minSat, maxSat);
    light = randomRange(minLight, maxLight);

    console.log(hue, sat, light);

    c.setHSL(hue, sat, light);

    return c;
}

export function MonochromaticPalette(
    color : Color,
    satRange: number = 1,
    lightRange: number = 1)
    : Palette
{
    let p = new Palette();

    // generate four lots of colors
    p.colorTL = colorFrom(color, 0, satRange, lightRange);
    p.colorTR = colorFrom(color, 0, satRange, lightRange);
    p.colorBL = colorFrom(color, 0, satRange, lightRange);
    p.colorBR = colorFrom(color, 0, satRange, lightRange);

    return p;
}