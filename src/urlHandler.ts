import Palette from "./Palette/Palette";
const queryString = require('query-string');

export function setURL(palette: Palette) {
    const url = {
        tl: palette.colorTL.asHex(),
        tr: palette.colorTR.asHex(),
        bl: palette.colorBL.asHex(),
        br: palette.colorBR.asHex(),
    }

    setQueryStringWithoutReload(queryString.stringify(url));
}

function setQueryStringWithoutReload(queryValue : string) {
    const newUrl =
                window.location.protocol + "//" +
                window.location.host +
                window.location.pathname + "?" +
                queryValue;
    window.history.replaceState({path: newUrl}, "", newUrl);
}