import {
  CurrentColorSpace,
  HueAngle,
  Saturation,
  ValueOrLightness,
} from "./colorPickerState";

import { arrayTohex } from "../helperFunctions/utils";
import { color } from "../../colorFunctions/main";

const VLOutputLabel = document.querySelector('label[for="VLOutput"]');
const VLPaletteLabel = document.querySelector('label[for="VLPalette"]');

const HexOutput = document.getElementById("HexOutput");
const ColorOutput = document.getElementById("ColorDisplay");

var outputTick = 0;
var hashTimeout;

export function UpdateColorOutput() {
  const requiredColor = arrayTohex(color.fromFunctions[CurrentColorSpace](HueAngle, Saturation, ValueOrLightness));

  clearTimeout(hashTimeout);
  hashTimeout = setTimeout(() => {
    history.replaceState(null, null, `${requiredColor}`);
    outputTick = 0;
  }, 20);

  outputTick += 1;

  if (outputTick > 15000) {
    history.replaceState(null, null, `${requiredColor}`);
    outputTick = 0;
  }

  ColorOutput.style.backgroundColor = requiredColor;
  HexOutput.value = requiredColor;

  if (CurrentColorSpace == "hsl" || CurrentColorSpace == "okhsl") {
    VLOutputLabel.innerHTML = "Lightness";
    VLPaletteLabel.innerHTML = "Lightness";
  } else {
    VLOutputLabel.innerHTML = "Value";
    VLPaletteLabel.innerHTML = "Value";
  }
}

