import { okhsv } from "./okhsv.js"
import { okhsl } from "./okhsl.js"
import { hsl } from "./hsl.js";
import { hsv } from "./hsv.js";

export let color = {
  fromFunctions: {
    hsv: function(h, s, v) {
      if (v == 0) {
        return [0, 0, 0]
      }
      return hsv.hsv_to_rgb(h / 360, s, v);
    },

    hsl: function(h, s, l) {
      if (l == 0) {
        return [0, 0, 0]
      }
      return hsl.hsl_to_rgb(h / 360, s, l);
    },

    okhsl: function(h, s, l) {
      if (l == 0) {
        return [0, 0, 0]
      }
      return okhsl.okhsl_to_rgb(h / 360, s, l);
    },
    okhsv: function(h, s, v) {
      if (v == 0) {
        return [0, 0, 0]
      }
      return okhsv.okhsv_to_rgb(h / 360, s, v);
    },
  },

  toFunctions: {
    hsv: hsv.rgb_to_hsv,
    hsl: hsl.rgb_to_hsl,
    okhsl: okhsl.rgb_to_okhsl,
    okhsv: okhsv.rgb_to_okhsv,
  },


  convertColorSpace: function(from, h, s, vl, to) {
    return this.toFunctions[to](...this.fromFunctions[from](h, s, vl));
  }
}

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
