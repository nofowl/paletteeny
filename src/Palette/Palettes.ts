import Color from "./Color";

export type Palette = {
    tl: Color;
    tr: Color;
    bl: Color;
    br: Color;
}

function randomVariance(min: number, max: number) : number {
    return min + (max - min) * Math.random();
}

export function colorFromColor(
    color : Color,
    hueVariance: number = 1,
    satVariance: number = 1,
    lightVariance: number = 1)
    : Color
{
    let hue = color.hue();
    let sat = color.saturation();
    let light = color.lightness();

    return colorFrom(hue, sat, light, hueVariance, satVariance, lightVariance);
}

function colorFrom(
    hue: number,
    sat: number,
    light: number,
    hueVariance: number = 1,
    satVariance: number = 1,
    lightVariance: number = 1)
    : Color
{
    let c = new Color();

    let minHue = 360 * (1 - hueVariance), maxHue = 360 * (1 + hueVariance);
    let minSat = sat - (sat * satVariance), maxSat = sat + (1 - sat) * satVariance;
    let minLight = light - (light * lightVariance), maxLight = light + (1 - light) * lightVariance;

    hue = (hue + randomVariance(minHue, maxHue)) % 360;
    sat = randomVariance(minSat, maxSat);
    light = randomVariance(minLight, maxLight);

    c.setHSL(hue, sat, light);

    return c;
}

// I don't know JS ok
export function CopiedPalette(
    palette : Palette)
    : Palette
{
    let p = {} as Palette;
    p.tl = palette.tl;
    p.tr = palette.tr;
    p.bl = palette.bl;
    p.br = palette.br;

    return p;
}

export function MonochromaticPalette(
    color : Color,
    satVariance: number = 1,
    lightVariance: number = 1)
    : Palette
{
    let p = {} as Palette;

    // generate four lots of colors
    p.tl = colorFromColor(color, 0, satVariance, lightVariance);
    p.tr = colorFromColor(color, 0, satVariance, lightVariance);
    p.bl = colorFromColor(color, 0, satVariance, lightVariance);
    p.br = colorFromColor(color, 0, satVariance, lightVariance);

    return p;
}

export function AnalogousPalette(
    color: Color,
    hueVariance: number = 1,
    satVariance: number = 1,
    lightVariance: number = 1)
    : Palette
{
    let p = {} as Palette;

    // generate four lots of colors
    p.tl = colorFromColor(color, hueVariance, satVariance, lightVariance);
    p.tr = colorFromColor(color, hueVariance, satVariance, lightVariance);
    p.bl = colorFromColor(color, hueVariance, satVariance, lightVariance);
    p.br = colorFromColor(color, hueVariance, satVariance, lightVariance);

    return p;
}

export function SymmetricPalette(
    color: Color,
    hueVariance: number = 1,
    satVariance: number = 1,
    lightVariance: number = 1)
    : Palette
{
    let p = {} as Palette;

    // generate four lots of colors
    let h = color.hue(), s = color.saturation(), l = color.lightness();

    // Two pairs of colours
    p.tl = colorFrom(h, s, l, hueVariance, satVariance, lightVariance);
    p.tr = colorFrom((h + 180) % 360, s, l, hueVariance, satVariance, lightVariance);
    p.bl = colorFrom((h + 180) % 360, s, l, hueVariance, satVariance, lightVariance);
    p.br = colorFrom(h, s, l, hueVariance, satVariance, lightVariance);

    return p;
}

export function TriadicPalette(
    color: Color,
    hueVariance: number = 1,
    satVariance: number = 1,
    lightVariance: number = 1)
    : Palette
{
    let p = {} as Palette;

    // generate four lots of colors
    let h = color.hue(), s = color.saturation(), l = color.lightness();

    // A triangle, and then something close to the first colour
    p.tl = colorFrom(h, s, l, hueVariance, satVariance, lightVariance);
    p.tr = colorFrom((h + 140) % 360, s, l, hueVariance, satVariance, lightVariance);
    p.bl = colorFrom((h + 220) % 360, s, l, hueVariance, satVariance, lightVariance);
    p.br = colorFrom(h, s, l, hueVariance, satVariance, lightVariance);

    return p;
}
export function TetradicPalette(
    color: Color,
    hueVariance: number = 1,
    satVariance: number = 1,
    lightVariance: number = 1)
    : Palette
{
    let p = {} as Palette;

    // generate four lots of colors
    let h = color.hue(), s = color.saturation(), l = color.lightness();

    // Similar to square palette, but more rectangular
    p.tl = colorFrom(h, s, l, hueVariance, satVariance, lightVariance);
    p.tr = colorFrom((h + 60) % 360, s, l, hueVariance, satVariance, lightVariance);
    p.bl = colorFrom((h + 180) % 360, s, l, hueVariance, satVariance, lightVariance);
    p.br = colorFrom((h + 240) % 360, s, l, hueVariance, satVariance, lightVariance);

    return p;
}

export function SquarePalette(
    color: Color,
    hueVariance: number = 1,
    satVariance: number = 1,
    lightVariance: number = 1)
    : Palette
{
    let p = {} as Palette;

    // generate four lots of colors
    let h = color.hue(), s = color.saturation(), l = color.lightness();

    p.tl = colorFrom(h, s, l, hueVariance, satVariance, lightVariance);
    p.tr = colorFrom((h + 90) % 360, s, l, hueVariance, satVariance, lightVariance);
    p.bl = colorFrom((h + 180) % 360, s, l, hueVariance, satVariance, lightVariance);
    p.br = colorFrom((h + 270) % 360, s, l, hueVariance, satVariance, lightVariance);

    return p;
}