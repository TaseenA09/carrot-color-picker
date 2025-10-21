export function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

export function arrayTohex(array) {
    let output = "#";
    for (let i = 0; i < array.length; i++) {
        output += (Math.round(clamp(array[i], 0, 255))).toString(16).padStart(2, '0');
    }
    return output
}

export function hexToArray(hex) {
    let input = hex;

    if (hex[0] == "#" || hex.length > 6 || (hex.match(/[^0-9a-fA-F]{1,1}/))) {
        input = input.slice(1);
    }

    let array

    if (input.length == 3) {
        array = input.match(/[0-9a-fA-F]/g);
        array = array.map(x => x + x);
    } else if (input.length == 2) {
        array = Array(3).fill(input.match(/[0-9a-fA-F]{1,2}/));
    } else if (input.length == 1) {
        array = Array(3).fill(input);
        array = array.map(x => x + x);
    }
    else {
        array = input.match(/[0-9a-fA-F]{1,2}/g);
    }

    if (!array) {
        return [0, 0, 0]
    }

    let output = [...array, ...Array(Math.max(3 - array.length, 0)).fill(0)]
    output = output.map(x => parseInt(x, 16));
    output = output.map(x => Number.isNaN(x) ? 0 : x);

    return output;
}

export function roundValue(_value) {
    const _ROUNDING = 10;

    return Math.round(_value * _ROUNDING) / _ROUNDING;
}

var goof = 1
goof += 1

import { Mouse } from "./Mouse";

export function GetAngleCursorFromItem(item) {
    const itemBox = item.getBoundingClientRect();
    const itemCenter = { x: itemBox.left + itemBox.width / 2, y: itemBox.top + itemBox.height / 2 };

    return Math.atan2(Mouse.y - itemCenter.y, Mouse.x - itemCenter.x) * (180 / Math.PI);
}

