import {Palette} from "./Palette/Palettes";
import queryString from 'query-string';

type Additional = {[key: string]: string}

function urlForPalette(palette: Palette, additional: Additional = {}) {
    const query = queryString.stringify({
        tl: palette.tl.asHex(false),
        tr: palette.tr.asHex(false),
        bl: palette.bl.asHex(false),
        br: palette.br.asHex(false),
        ...additional,
    });

    return window.location.protocol + "//" +
    window.location.host +
    window.location.pathname + "?" +
    query;
}

export function shareUrlForPalette(palette: Palette) {
    return urlForPalette(palette, { utm_source: 'share' });
}

export const SHARE_TITLE = 'Paletteeny';

export const SHARE_TEXT = 'Check out my teeny palette on Paletteeny!'

export function shareStringForPalette(palette: Palette) {
    return `${SHARE_TEXT}: ${shareUrlForPalette(palette)}`;
}