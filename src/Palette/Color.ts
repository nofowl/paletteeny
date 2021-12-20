function channelHex(channel : number) : string {
    let str = Math.round(channel * 255).toString(16);
    if (str.length < 2) {
        str = "0" + str;
    }
    return str;
}

class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    private val: number = 0;
    private cmin: number = 0;
    private chroma: number = 0;

    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1.0) {
        this.r = Math.max(0, Math.min(1, r));
        this.g = Math.max(0, Math.min(1, g));;
        this.b = Math.max(0, Math.min(1, b));;
        this.a = Math.max(0, Math.min(1, a));;

        this.generate();
    } 

    generate() {
        this.val = Math.max(this.r, this.g, this.b);
        this.cmin = Math.min(this.r, this.g, this.b);
        this.chroma = this.val - this.cmin;
    }

    asArray() : number[] {
        return [this.r, this.g, this.b, this.a]
    }

    asHex() : string {
        return (
            channelHex(this.r) +
            channelHex(this.g) +
            channelHex(this.b)
        )
    }

    setHSL(hue: number, sat: number, light: number) {
        let c = (1 - Math.abs(2 * light - 1)) * sat;

        let hp = hue / 60;
        let x = c * (1 - Math.abs((hp % 2) - 1));

        let r = 0, g = 0, b = 0;

        if (hp < 1) {
            r = c;
            g = x;
        } else if (hp < 2) {
            r = x;
            g = c;
        } else if (hp < 3) {
            g = c;
            b = x;
        } else if (hp < 4) {
            g = x;
            b = c;
        } else if (hp < 5) {
            r = x;
            b = c;
        } else if (hp < 6) {
            r = c;
            b = x;
        }

        let m = light - (c / 2);

        this.r = r + m;
        this.g = g + m;
        this.b = b + m;

        this.generate();
    }

    hue() : number {
        if (this.chroma === 0) return 0;

        if (this.r > this.g && this.r > this.b) {
            return 60 * ((this.g - this.b) / this.chroma);
        } else if (this.g > this.r && this.g > this.b) {
            return 60 * (2 + (this.b - this.r) / this.chroma);
        } else {
            return 60 * (4 + (this.r - this.g) / this.chroma);
        }
    }

    saturation() : number {
        if (this.val === 0) {
            return 0;
        } else {
            return this.chroma / this.val;
        }
    }

    value() : number {
        return this.val;
    }

    lightness() : number {
        return this.val - (this.chroma / 2);
    }
}

export function RandomColor() : Color {
    let c = new Color(
        Math.random(),
        Math.random(),
        Math.random(),
        );

    return c;
}

export function HexColor(hex: string) : Color {
    var result = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        let c = new Color(
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255
            );
        return c;
    }
    return RandomColor();
}

export default Color;