import { DoTimeout } from "../helperFunctions/timeout";
import {
  ColorWheel,
  DefaultDrawTimeOut,
  Saturation,
  ValueOrLightness,
  HueAngle,
  CurrentColorSpace,
  ColorWheelWidth,
} from "./colorPickerState";
import { arrayTohex } from "../helperFunctions/utils";
import { color } from "../../colorFunctions/main";

var SaturationCache = Saturation;
var ValueOrLightnessCache = ValueOrLightness;

// Drawer

const ModifierBoxPadding = 8;
const ModifierBoxBorder = 4;

const ModifierBox = document.getElementById("ModifierBox");
const ModifierBoxCursor = document.getElementById("ModifierBoxCursor");

const ModifierBoxCursorWidth = 0.1;
const ModifierBoxCursorStroke = 4;

export function DrawModifierBox(timeoutTime) {
  timeoutTime = isNaN(timeoutTime) ? DefaultDrawTimeOut : timeoutTime;
  DoTimeout("ModifierBox", () => {
    const dpr = window.devicePixelRatio || 1;

    const ctxModifierBox = ModifierBox.getContext("2d");
    ctxModifierBox.clearRect(0, 0, ModifierBox.width, ModifierBox.height);

    const colorWheelBoundingBox = ColorWheel.getBoundingClientRect();
    const colorWheelSize = (Math.min(colorWheelBoundingBox.width, colorWheelBoundingBox.height) / 2) - 20 - (ColorWheelWidth * Math.min(colorWheelBoundingBox.width, colorWheelBoundingBox.height) / 2);

    const largestSize = (colorWheelSize * Math.sqrt(2)) - ModifierBoxBorder;

    ModifierBox.height = (largestSize - ModifierBoxPadding);
    ModifierBox.width = (largestSize - ModifierBoxPadding);

    ModifierBox.style.height = ModifierBox.height + "px";
    ModifierBox.style.width = ModifierBox.width + "px";

    ctxModifierBox.scale(dpr, dpr);

    ctxModifierBox.fillStyle = "#00000030";
    ctxModifierBox.fillRect(0, 0, ModifierBox.height, ModifierBox.width);

    const colorArea = {
      height: ModifierBox.height - ModifierBoxBorder,
      width: ModifierBox.width - ModifierBoxBorder
    }

    const imageData = ctxModifierBox.createImageData(colorArea.width, colorArea.height);
    const data = imageData.data;

    for (let y = 0; y <= colorArea.height; y++) {
      for (let x = 0; x < colorArea.width; x++) {
        var colorRequired = color.fromFunctions[CurrentColorSpace](HueAngle, x / colorArea.width, 1 - y / colorArea.height);
        var pixelIndex = ((y * colorArea.width) + x) * 4;

        data[pixelIndex] = colorRequired[0];
        data[pixelIndex + 1] = colorRequired[1];
        data[pixelIndex + 2] = colorRequired[2];
        data[pixelIndex + 3] = 255;
      }
    }

    ctxModifierBox.putImageData(imageData, ModifierBoxBorder / 2, ModifierBoxBorder / 2);
  }, timeoutTime);
}

export function DrawModifierBoxCursor() {
  const dpr = window.devicePixelRatio || 1;

  const ctxCursorBox = ModifierBoxCursor.getContext("2d");

  ModifierBoxCursor.height = ModifierBox.height;
  ModifierBoxCursor.width = ModifierBox.width;

  ModifierBoxCursor.style.height = ModifierBox.height + "px";
  ModifierBoxCursor.style.width = ModifierBox.width + "px";

  ModifierBoxCursor.getContext("2d").scale(dpr, dpr);

  ctxCursorBox.clearRect(0, 0, ModifierBoxCursor.width / dpr, ModifierBoxCursor.height / dpr);

  ctxCursorBox.beginPath();

  let border = ModifierBoxBorder / 2

  const cursorWidth = ModifierBoxCursorWidth * ModifierBoxCursor.width;

  ctxCursorBox.rect(
    (((ModifierBoxCursor.width - ModifierBoxBorder - cursorWidth) * Saturation) + border + ModifierBoxCursorStroke / 2) / dpr,
    (((ModifierBoxCursor.height - ModifierBoxBorder - cursorWidth) * (1 - ValueOrLightness)) + border + ModifierBoxCursorStroke / 2) / dpr,
    (cursorWidth - (ModifierBoxCursorStroke)) / dpr,
    (cursorWidth - (ModifierBoxCursorStroke)) / dpr,
  );

  ctxCursorBox.strokeStyle = "#000000a0";
  ctxCursorBox.lineWidth = 6 / dpr;
  ctxCursorBox.stroke();

  ctxCursorBox.strokeStyle = "#ffffffa0";
  ctxCursorBox.lineWidth = 3 / dpr;
  ctxCursorBox.stroke();

  ctxCursorBox.fillStyle = arrayTohex(color.fromFunctions[CurrentColorSpace](HueAngle, Saturation, ValueOrLightness));

  ctxCursorBox.fill();
}

// Updater
import { roundValue } from "../helperFunctions/utils";
import { clamp } from "../helperFunctions/utils";
import { Mouse } from "../helperFunctions/Mouse";
import { vlTextOutput, satTextOutput } from "./colorPickerState";
import { UpdateSaturation, UpdateValueOrLightness } from "./colorPickerState";

export function UpdateSandVL() {
  const modifierBoundingBox = ModifierBox.getBoundingClientRect();
  let modifierBoxOneSide = ModifierBoxBorder / 2

  UpdateSaturation(roundValue(clamp((Mouse.x - (modifierBoundingBox.x + modifierBoxOneSide)) / (modifierBoundingBox.width - ModifierBoxBorder), 0, 1) * 100) / 100);
  UpdateValueOrLightness(roundValue((1 - clamp((Mouse.y - (modifierBoundingBox.y + modifierBoxOneSide)) / (modifierBoundingBox.height - ModifierBoxBorder), 0, 1)) * 100) / 100);

  vlTextOutput.value = roundValue(ValueOrLightness * 100);
  satTextOutput.value = roundValue(Saturation * 100);
}

