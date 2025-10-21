import { DoTimeout } from "../helperFunctions/timeout.js";
import {
  DefaultDrawTimeOut,
  ColorWheelCursorCanvas,
  CurrentColorSpace,
  HueAngle, Saturation, ValueOrLightness,
  ColorWheelWidth,
} from "./colorPickerState.js";
import { arrayTohex } from "../helperFunctions/utils.js";
import { color } from "../../colorFunctions/main.js";

// Drawer

const ColorWheelMaxSize = 500;

export const ColorWheelCursorSize = 2;

const ColorWheel = document.getElementById("ColorWheel");
ColorWheel.style.maxWidth = ColorWheelMaxSize + "px";
ColorWheel.style.maxHeight = ColorWheelMaxSize + "px";

const ColorSelector = document.getElementsByClassName("ColorSelector")[0];
const ColorWheelCursor = document.getElementById("ColorWheelCursor");

ColorWheelCursor.style.maxWidth = ColorWheel.style.maxWidth;
ColorWheelCursor.style.maxHeight = ColorWheel.style.maxHeight;

const ctxColorWheel = ColorWheel.getContext("2d");

ctxColorWheel.imageSmoothingEnabled = true;
ctxColorWheel.imageSmoothingQuality = 'high';

var HueAngleCache = -1;

export function DrawColorWheel(timeoutTime) {
  timeoutTime = isNaN(timeoutTime) ? DefaultDrawTimeOut : timeoutTime;
  DoTimeout("ColorWheel", () => {
    if (ColorSelector.style.display == "none") {
      return
    }

    ctxColorWheel.clearRect(0, 0, ColorWheel.width, ColorWheel.height);

    const dpr = window.devicePixelRatio || 1;

    const colorWheelBoundingBox = ColorWheel.getBoundingClientRect();
    const colorWheelSize = (Math.min(colorWheelBoundingBox.width, colorWheelBoundingBox.height) / 2) - 20;

    ColorWheel.height = colorWheelBoundingBox.height * dpr;
    ColorWheel.width = colorWheelBoundingBox.width * dpr;

    ctxColorWheel.scale(dpr, dpr);

    const colorWheelCenter = {
      x: colorWheelBoundingBox.width / 2,
      y: colorWheelBoundingBox.height / 2
    };

    const colorWheelGradient = ctxColorWheel.createConicGradient(-Math.PI * 0.5, colorWheelCenter.x, colorWheelCenter.y);

    for (let angle = 0; angle <= 360; angle++) {
      colorWheelGradient.addColorStop(angle / 360, arrayTohex(color.fromFunctions[CurrentColorSpace](angle, Saturation, ValueOrLightness)));
    }

    ctxColorWheel.beginPath();
    ctxColorWheel.arc(colorWheelCenter.x, colorWheelCenter.y, colorWheelSize, 0, Math.PI * 2);

    const colorWidth = ColorWheelWidth * Math.min(colorWheelBoundingBox.height, colorWheelBoundingBox.width);

    ctxColorWheel.strokeStyle = "#00000030";
    ctxColorWheel.lineWidth = colorWidth + 3;
    ctxColorWheel.stroke()

    ctxColorWheel.strokeStyle = colorWheelGradient;
    ctxColorWheel.lineWidth = colorWidth;
    ctxColorWheel.stroke();

    ctxColorWheel.beginPath();
    ctxColorWheel.arc(colorWheelCenter.x, colorWheelCenter.y, colorWheelSize + ((colorWidth / 2) - 1), 0, Math.PI * 2);
    ctxColorWheel.strokeStyle = "#ffffff30";
    ctxColorWheel.lineWidth = 2;
    ctxColorWheel.stroke();

    ctxColorWheel.beginPath();
    ctxColorWheel.arc(colorWheelCenter.x, colorWheelCenter.y, colorWheelSize - ((colorWidth / 2) - 1), 0, Math.PI * 2);
    ctxColorWheel.strokeStyle = "#ffffff30";
    ctxColorWheel.lineWidth = 2;

    ctxColorWheel.stroke();

    HueAngleCache = HueAngle;
  }, timeoutTime);
}

export function DrawColorWheelCursor() {
  if (ColorSelector.style.display == "none") {
    return
  }

  const ctxCursor = ColorWheelCursorCanvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  ctxCursor.clearRect(0, 0, ColorWheelCursorCanvas.width, ColorWheelCursorCanvas.height);

  ctxCursor.beginPath();

  const colorWheelBoundingBox = ColorWheelCursorCanvas.getBoundingClientRect();
  const colorWheelSize = (Math.min(colorWheelBoundingBox.width, colorWheelBoundingBox.height) / 2) - 20;
  const colorWheelCenter = {
    x: colorWheelBoundingBox.width / 2,
    y: colorWheelBoundingBox.height / 2
  };

  ColorWheelCursorCanvas.height = colorWheelBoundingBox.height * dpr;
  ColorWheelCursorCanvas.width = colorWheelBoundingBox.width * dpr;

  ctxCursor.scale(dpr, dpr);

  const colorWidth = ColorWheelWidth * Math.min(colorWheelBoundingBox.height, colorWheelBoundingBox.width);
  const wheelSize = ColorWheelCursorSize
  ctxCursor.arc(colorWheelCenter.x, colorWheelCenter.y, colorWheelSize - ((colorWidth / 2) - 1), ((Math.PI / 180) * (HueAngle - 90 + wheelSize)), ((Math.PI / 180) * (HueAngle - 90 - wheelSize)), true)
  ctxCursor.arc(colorWheelCenter.x, colorWheelCenter.y, colorWheelSize + ((colorWidth / 2) - 1), ((Math.PI / 180) * (HueAngle - 90 - wheelSize)), ((Math.PI / 180) * (HueAngle - 90 + wheelSize)), false)
  ctxCursor.closePath();

  ctxCursor.fillStyle = arrayTohex(color.fromFunctions[CurrentColorSpace.slice(0, -1) + "v"](HueAngle, 1, 1));


  ctxCursor.lineWidth = 6 / dpr;
  ctxCursor.strokeStyle = "#000000a0";

  ctxCursor.stroke();

  ctxCursor.strokeStyle = "#ffffffa0";

  ctxCursor.lineWidth = 4 / dpr;

  ctxCursor.stroke();

  ctxCursor.fill();
}

// Updater
import { UpdateHueAngle, hueTextOutput } from "./colorPickerState.js";
import { roundValue, GetAngleCursorFromItem } from "../helperFunctions/utils.js";

export function UpdateHue() {
  let inputHueAngle = roundValue((GetAngleCursorFromItem(ColorWheel) + 90) * 1) / 1;
  UpdateHueAngle(inputHueAngle < 0 ? inputHueAngle + 360 : inputHueAngle);

  hueTextOutput.value = roundValue(HueAngle);
}
