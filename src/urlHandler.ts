import {Palette} from "./Palette/Palettes";
const queryString = require('query-string');

export function setURL(palette: Palette) {
    setQueryStringWithoutReload(urlForPalette(palette));
}

function setQueryStringWithoutReload(url : string) {
    window.history.replaceState({}, "test url", url);
}

function urlForPalette(palette: Palette) {
    let end = queryString.stringify({
        tl: palette.tl.asHex(),
        tr: palette.tr.asHex(),
        bl: palette.bl.asHex(),
        br: palette.br.asHex(),
    });

    return window.location.protocol + "//" +
    window.location.host +
    window.location.pathname + "?" +
    end;
}

export function shareUrlForPalette(palette: Palette) {
    return "Check out my teeny palette on Paletteeny: " +
    urlForPalette(palette);
}