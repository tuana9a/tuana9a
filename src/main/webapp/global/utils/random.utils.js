"user strict";

export default {
    color_hex(r = { s: 0, e: 255 }, g = { s: 0, e: 255 }, b = { s: 0, e: 255 }) {
        let red = Math.floor(r.s + Math.random() * (r.e - r.s));
        let green = Math.floor(g.s + Math.random() * (g.e - g.s));
        let blue = Math.floor(b.s + Math.random() * (b.e - b.s));
        red = red > 15 ? red.toString(16) : `0${red.toString(16)}`;
        green = green > 15 ? green.toString(16) : `0${green.toString(16)}`;
        blue = blue > 15 ? blue.toString(16) : `0${blue.toString(16)}`;
        return `#${red + green + blue}`;
    },
    color_rgb(r = { start: 0, end: 255 }, g = { start: 0, end: 255 }, b = { start: 0, end: 255 }) {
        const red = Math.floor(r.start + Math.random() * (r.end - r.start));
        const green = Math.floor(g.start + Math.random() * (g.end - g.start));
        const blue = Math.floor(b.start + Math.random() * (b.end - b.start));
        return `rgb(${red},${green},${blue}`;
    },
};
