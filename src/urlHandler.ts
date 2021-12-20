import {Palette} from "./Palette/Palettes";
const queryString = require('query-string');

function urlForPalette(palette: Palette) {
    const query = queryString.stringify({
        tl: palette.tl.asHex(),
        tr: palette.tr.asHex(),
        bl: palette.bl.asHex(),
        br: palette.br.asHex(),
    });

    return window.location.protocol + "//" +
    window.location.host +
    window.location.pathname + "?" +
    query;
}

export function shareUrlForPalette(palette: Palette) {
    return urlForPalette(palette) + queryString.stringify({ utm_source: 'share' });
}

export const SHARE_TITLE = 'Paletteeny';

export const SHARE_TEXT = 'Check out my teeny palette on Paletteeny'

export function shareStringForPalette(palette: Palette) {
    return `${SHARE_TEXT}: ${shareUrlForPalette(palette)}`;
}