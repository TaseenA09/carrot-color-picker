
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

import { toe_inv, oklab_to_linear_srgb, srgb_transfer_function, get_ST_max, toe, linear_srgb_to_oklab, srgb_transfer_function_inv } from "./common.js";

export let okhsv = {
  okhsv_to_rgb: function(h, s, v) {
    let a_ = Math.cos(2 * Math.PI * h);
    let b_ = Math.sin(2 * Math.PI * h);

    let ST_max = get_ST_max(a_, b_);
    let S_max = ST_max[0];
    let S_0 = 0.5;
    let T = ST_max[1];
    let k = 1 - S_0 / S_max;

    let L_v = 1 - s * S_0 / (S_0 + T - T * k * s)
    let C_v = s * T * S_0 / (S_0 + T - T * k * s)

    let L = v * L_v;
    let C = v * C_v;

    // to present steps along the way
    //L = v;
    //C = v*s*S_max;
    //L = v*(1 - s*S_max/(S_max+T));
    //C = v*s*S_max*T/(S_max+T);

    let L_vt = toe_inv(L_v);
    let C_vt = C_v * L_vt / L_v;

    let L_new = toe_inv(L); // * L_v/L_vt;
    C = C * L_new / L;
    L = L_new;

    let rgb_scale = oklab_to_linear_srgb(L_vt, a_ * C_vt, b_ * C_vt);
    let scale_L = Math.cbrt(1 / (Math.max(rgb_scale[0], rgb_scale[1], rgb_scale[2], 0)));

    // remove to see effect without rescaling
    L = L * scale_L;
    C = C * scale_L;

    let rgb = oklab_to_linear_srgb(L, C * a_, C * b_);
    return [
      255 * srgb_transfer_function(rgb[0]),
      255 * srgb_transfer_function(rgb[1]),
      255 * srgb_transfer_function(rgb[2]),
    ]
  },

  rgb_to_okhsv: function(r, g, b) {
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

    let ST_max = get_ST_max(a_, b_);
    let S_max = ST_max[0];
    let S_0 = 0.5;
    let T = ST_max[1];
    let k = 1 - S_0 / S_max;

    let t = T / (C + L * T);
    let L_v = t * L;
    let C_v = t * C;

    let L_vt = toe_inv(L_v);
    let C_vt = C_v * L_vt / L_v;

    let rgb_scale = oklab_to_linear_srgb(L_vt, a_ * C_vt, b_ * C_vt);
    let scale_L = Math.cbrt(1 / (Math.max(rgb_scale[0], rgb_scale[1], rgb_scale[2], 0)));

    L = L / scale_L;
    C = C / scale_L;

    C = C * toe(L) / L;
    L = toe(L);

    let v = L / L_v;
    let s = (S_0 + T) * C_v / ((T * S_0) + T * k * C_v)

    return [h, s, v];
  },
}
