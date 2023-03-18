import {Color} from "../../base/logic/style/Color";

export class ColorMixin extends Map<string, Color | string> {

    constructor(base: Map<string, Color | string> | undefined = undefined) {
        super(base);
    }

    public getColor(key: string, defaultValue: string = "#000000"): string {
        const color: Color | string | undefined = this.get(key);
        if (color === undefined) return defaultValue;
        if (typeof color === "string") return color;
        return color.css();
    }
}


