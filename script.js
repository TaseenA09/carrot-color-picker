import Color from './third_party/color.js-main/color.js';
import okhsv from './third_party/color.js-main/src/spaces/okhsv.js';
import { clamp, isNone } from './third_party/color.js-main/src/util.js';

const ColorWheel = document.getElementById("colorwheel");

function ReloadColorWheel(colorWheel, colorWheelWidth) {
  const ctxColorWheel = colorWheel.getContext("2d");
  const colorWheelBoundingBox = colorWheel.getBoundingClientRect();
  const colorWheelSize = Math.min(colorWheelBoundingBox.width, colorWheelBoundingBox.height) / 2;
  const colorWheelGradient = ctxColorWheel.createConicGradient(0, colorWheelBoundingBox.width / 2, colorWheelBoundingBox.height / 2);

  for (let angle = 0; angle <= 360; angle++) {
    colorWheelGradient.addColorStop(angle / 360, new Color(okhsv, [angle, 1, 1]).toString({ format: "hex" }));
  }

  ctxColorWheel.beginPath();
  ctxColorWheel.strokeStyle = colorWheelGradient;
  ctxColorWheel.lineWidth = colorWheelWidth;
  ctxColorWheel.arc(colorWheelBoundingBox.width / 2, colorWheelBoundingBox.height / 2, colorWheelSize - colorWheelWidth, 0, Math.PI * 2);

  ctxColorWheel.stroke();
}

function GetAngleCursorFromWheelCenter() {
  const colorWheelCenter = 2;
}

var MouseDown = false;

ColorWheel.onmousedown = function() {
  MouseDown = true
}

onmouseup = function() {
  MouseDown = false;
}

onmousemove = function() {
  if (MouseDown == true) {
  }
}

ReloadColorWheel(ColorWheel, 15);
