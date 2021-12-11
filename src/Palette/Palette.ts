import Color, {RandomColor} from "./Color";

class Palette {
    colorTL: Color;
    colorTR: Color;
    colorBL: Color;
    colorBR: Color;

    constructor() {
        this.colorTL = RandomColor();
        this.colorTR = RandomColor();
        this.colorBL = RandomColor();
        this.colorBR = RandomColor();
    }
}

export default Palette;