import {Palette} from "./Palette/Palettes";
const queryString = require('query-string');

export function setURL(palette: Palette) {
    const url = {
        tl: palette.tl.asHex(),
        tr: palette.tr.asHex(),
        bl: palette.bl.asHex(),
        br: palette.br.asHex(),
    }

    setQueryStringWithoutReload(queryString.stringify(url));
}

function setQueryStringWithoutReload(queryValue : string) {
    const newUrl =
                window.location.protocol + "//" +
                window.location.host +
                window.location.pathname + "?" +
                queryValue;
    window.history.replaceState({}, "test url", newUrl);
}