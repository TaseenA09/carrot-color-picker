import {
  UpdateButtonsFromColorSpace,
  HueAngle, ValueOrLightness, Saturation,
  hueTextOutput, vlTextOutput, satTextOutput,
  DefaultDrawTimeOut
} from "./colorPickerState";
import { roundValue } from "../helperFunctions/utils";

import { DrawColorWheel, DrawColorWheelCursor } from "./colorWheel.js";
import { DrawModifierBox, DrawModifierBoxCursor } from "./colorModifierBox.js"

UpdateButtonsFromColorSpace()

hueTextOutput.value = roundValue(HueAngle);
vlTextOutput.value = roundValue(ValueOrLightness * 100);
satTextOutput.value = roundValue(Saturation * 100);

export function UpdateColorPicker() {
  DrawColorWheel(DefaultDrawTimeOut);
  DrawColorWheelCursor();
  DrawModifierBox(DefaultDrawTimeOut);
  DrawModifierBoxCursor();
}
