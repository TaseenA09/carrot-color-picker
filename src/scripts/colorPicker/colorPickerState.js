import { color } from "../../colorFunctions/main";
import { hexToArray } from "../helperFunctions/utils";

export let CurrentColorSpace = (document.querySelector('input[name="ColorOption"]:checked') || { value: "okhsv" }).value;
const startingValue = color.toFunctions[CurrentColorSpace](...hexToArray(window.location.hash));

export var HueAngle = startingValue[0] * 360 || Math.random() * 360;
export var Saturation = startingValue[1] || Math.random();
export var ValueOrLightness = startingValue[2] || Math.random();

export const hueTextOutput = document.getElementById("HueOutput");
export const vlTextOutput = document.getElementById("VLOutput");
export const satTextOutput = document.getElementById("SaturationOutput");

export function UpdateHueAngle(angle) {
  HueAngle = angle
}

export function UpdateValueOrLightness(angle) {
  ValueOrLightness = angle
}

export function UpdateSaturation(angle) {
  Saturation = angle
}

// For both modifier box and color wheel
export const DefaultDrawTimeOut = 5;
export const ColorWheelWidth = 0.055;

export function UpdateButtonsFromColorSpace() {
  document.querySelectorAll('input[name="ColorOption"]').forEach(option => {
    option.checked = option.value == CurrentColorSpace;
  })
}

