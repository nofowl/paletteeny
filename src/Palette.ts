class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r: number, g: number, b: number, a: number = 1.0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    asArray() : number[] {
        return [this.r, this.g, this.b, this.a]
    }
};

class Palette {
    colorTL: Color;
    colorTR: Color;
    colorBL: Color;
    colorBR: Color;

    constructor() {
        this.colorTL = this.generateColor();
        this.colorTR = this.generateColor();
        this.colorBL = this.generateColor();
        this.colorBR = this.generateColor();
    }

    generateColor() : Color {
        let c = new Color(
            Math.random(),
            Math.random(),
            Math.random(),
            );

        return c;
    }
}

export default Palette;