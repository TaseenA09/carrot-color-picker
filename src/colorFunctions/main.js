import { okhsv } from "./okhsv.js"
import { okhsl } from "./okhsl.js"
import { hsl } from "./hsl.js";
import { hsv } from "./hsv.js";
import { compute_max_saturation } from "./common.js";

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
    okhsl: (r, g, b) => {
      let requiredColor = okhsl.rgb_to_okhsl(r, g, b);
      requiredColor = requiredColor.map((x) => isNaN(x) ? 0 : x);

      return requiredColor
    },
    okhsv: (r, g, b) => {
      let requiredColor = okhsv.rgb_to_okhsv(r, g, b);
      requiredColor = requiredColor.map((x) => isNaN(x) ? 0 : x);

      return requiredColor
    },

  },


  convertColorSpace: function(from, to, h, s, vl) {
    return this.toFunctions[to](...this.fromFunctions[from](h, s, vl));
  }
}
