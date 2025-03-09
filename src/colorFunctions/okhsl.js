
//  Copyright (c) 2021 Björn Ottosson
//  
//  Permission is hereby granted, free of charge, to any person obtaining a copy of
//  this software and associated documentation files (the "Software"), to deal in
//  the Software without restriction, including without limitation the rights to
//  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
//  of the Software, and to permit persons to whom the Software is furnished to do
//  so, subject to the following conditions:
//  The above copyright notice and this permission notice shall be included in all
//  copies or substantial portions of the Software.
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  SOFTWARE.

import { toe_inv, get_Cs, srgb_transfer_function, oklab_to_linear_srgb, linear_srgb_to_oklab, toe, srgb_transfer_function_inv, get_ST_max } from "./common.js";

export let okhsl = {
  okhsl_to_rgb: function(h, s, l) {
    if (l == 1) {
      return [255, 255, 255];
    }

    else if (l == 0) {
      return [0, 0, 0];
    }

    let a_ = Math.cos(2 * Math.PI * h);
    let b_ = Math.sin(2 * Math.PI * h);
    let L = toe_inv(l);

    let Cs = get_Cs(L, a_, b_);
    let C_0 = Cs[0];
    let C_mid = Cs[1];
    let C_max = Cs[2];

    let C, t, k_0, k_1, k_2;
    if (s < 0.8) {
      t = 1.25 * s;
      k_0 = 0;
      k_1 = 0.8 * C_0;
      k_2 = (1 - k_1 / C_mid);
    }
    else {
      t = 5 * (s - 0.8);
      k_0 = C_mid;
      k_1 = 0.2 * C_mid * C_mid * 1.25 * 1.25 / C_0;
      k_2 = (1 - (k_1) / (C_max - C_mid));
    }

    C = k_0 + t * k_1 / (1 - k_2 * t);

    // If we would only use one of the Cs:
    //C = s*C_0;
    //C = s*1.25*C_mid;
    //C = s*C_max;

    let rgb = oklab_to_linear_srgb(L, C * a_, C * b_);
    return [
      255 * srgb_transfer_function(rgb[0]),
      255 * srgb_transfer_function(rgb[1]),
      255 * srgb_transfer_function(rgb[2]),
    ]
  },

  rgb_to_okhsl: function(r, g, b) {
    let lab = linear_srgb_to_oklab(
      srgb_transfer_function_inv(r / 255),
      srgb_transfer_function_inv(g / 255),
      srgb_transfer_function_inv(b / 255)
    );

    let C = Math.sqrt(lab[1] * lab[1] + lab[2] * lab[2]);
    let a_ = lab[1] / C;
    let b_ = lab[2] / C;

    let L = lab[0];
    let h = 0.5 + 0.5 * Math.atan2(-lab[2], -lab[1]) / Math.PI;

    let Cs = get_Cs(L, a_, b_)
    let C_0 = Cs[0];
    let C_mid = Cs[1];
    let C_max = Cs[2];

    let s;
    if (C < C_mid) {
      let k_0 = 0;
      let k_1 = 0.8 * C_0;
      let k_2 = (1 - k_1 / C_mid);

      let t = (C - k_0) / (k_1 + k_2 * (C - k_0));
      s = t * 0.8;
    }
    else {
      let k_0 = C_mid;
      let k_1 = 0.2 * C_mid * C_mid * 1.25 * 1.25 / C_0;
      let k_2 = (1 - (k_1) / (C_max - C_mid));

      let t = (C - k_0) / (k_1 + k_2 * (C - k_0));
      s = 0.8 + 0.2 * t;
    }

    let l = toe(L);
    return [h, s, l];
  }
}
