import { color, arrayTohex, clamp } from "./colorFunctions/main.js";

let CurrentColorSpace = document.querySelector('input[name="colorOption"]:checked').value;

const ColorWheel = document.getElementById("colorwheel");
const ctxColorWheel = ColorWheel.getContext("2d");

ctxColorWheel.imageSmoothingEnabled = true;
ctxColorWheel.imageSmoothingQuality = 'high';

const ColorWheelWidth = 10;

const ModifierBox = document.getElementById("modifierbox");
const ModifierBoxCursor = document.getElementById("modifierboxcursor");

const CursorCanvas = document.getElementById("colorwheelcursor");
const CursorWidth = 10;

const ColorOutput = document.getElementById("colorOutput");

var HueAngle = Math.random() * 360;
var HueAngleCache = -1;

var Saturation = Math.random();
var ValueOrLightness = Math.random();

var SaturationCache = Saturation;
var ValueOrLightnessCache = ValueOrLightness;

function GetUnitFromAngle(angle) {
  return {
    x: Math.sin(-(angle + 180) * Math.PI / 180),
    y: Math.cos((angle + 180) * Math.PI / 180)
  };
}

function DrawColorWheel() {
  ctxColorWheel.clearRect(0, 0, ColorWheel.width, ColorWheel.height);

  const colorWheelBoundingBox = ColorWheel.getBoundingClientRect();
  const colorWheelSize = (Math.min(colorWheelBoundingBox.width, colorWheelBoundingBox.height) / 2) - 20;

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

  ctxColorWheel.strokeStyle = "#00000030";
  ctxColorWheel.lineWidth = ColorWheelWidth + 3;
  ctxColorWheel.stroke()

  ctxColorWheel.strokeStyle = colorWheelGradient;
  ctxColorWheel.lineWidth = ColorWheelWidth;
  ctxColorWheel.stroke();

  ctxColorWheel.beginPath();
  ctxColorWheel.arc(colorWheelCenter.x, colorWheelCenter.y, colorWheelSize + ((ColorWheelWidth / 2) - 1), 0, Math.PI * 2);
  ctxColorWheel.strokeStyle = "#ffffff30";
  ctxColorWheel.lineWidth = 2;
  ctxColorWheel.stroke();

  ctxColorWheel.beginPath();
  ctxColorWheel.arc(colorWheelCenter.x, colorWheelCenter.y, colorWheelSize - ((ColorWheelWidth / 2) - 1), 0, Math.PI * 2);
  ctxColorWheel.strokeStyle = "#ffffff30";
  ctxColorWheel.lineWidth = 2;

  ctxColorWheel.stroke();

  HueAngleCache = HueAngle
}

function DrawCursor() {
  const ctxCursor = CursorCanvas.getContext("2d");
  ctxCursor.clearRect(0, 0, CursorCanvas.width, CursorCanvas.height);

  ctxCursor.beginPath();

  var cursorUnit = GetUnitFromAngle(HueAngle);

  const colorWheelBoundingBox = ColorWheel.getBoundingClientRect();
  const colorWheelSize = (Math.min(colorWheelBoundingBox.width, colorWheelBoundingBox.height) / 2) - 20;
  const colorWheelCenter = {
    x: colorWheelBoundingBox.width / 2,
    y: colorWheelBoundingBox.height / 2
  };

  ctxCursor.moveTo((colorWheelCenter.x) + (cursorUnit.x * colorWheelSize), (colorWheelCenter.y) + (cursorUnit.y * colorWheelSize));

  cursorUnit = GetUnitFromAngle(HueAngle + 6);
  ctxCursor.lineTo((colorWheelCenter.x) + (cursorUnit.x * (colorWheelSize + CursorWidth)), (colorWheelCenter.y) + (cursorUnit.y * (colorWheelSize + CursorWidth)));

  cursorUnit = GetUnitFromAngle(HueAngle - 6);
  ctxCursor.lineTo((colorWheelCenter.x) + (cursorUnit.x * (colorWheelSize + CursorWidth)), (colorWheelCenter.y) + (cursorUnit.y * (colorWheelSize + CursorWidth)));

  ctxCursor.closePath();

  // ctxColorWheel.arc((colorWheelCenter.x) + (Math.sin(-(HueAngle + 180) * Math.PI / 180) * colorWheelSize), (colorWheelCenter.y) + (Math.cos((HueAngle + 180) * Math.PI / 180) * colorWheelSize), 15, 0, Math.PI * 2);
  ctxCursor.fillStyle = "#ffffff";

  ctxCursor.lineWidth = 3;
  ctxCursor.strokeStyle = "#00000050";

  ctxCursor.stroke();
  ctxCursor.fill();
}

const ModifierBoxPadding = 8;
const ModifierBoxBorder = 4;

function DrawModifierBox() {
  const ctxModifierBox = ModifierBox.getContext("2d");
  ctxModifierBox.clearRect(0, 0, ModifierBox.width, ModifierBox.height);

  const colorWheelBoundingBox = ColorWheel.getBoundingClientRect();
  const colorWheelSize = (Math.min(colorWheelBoundingBox.width, colorWheelBoundingBox.height) / 2) - 20 - (ColorWheelWidth / 2);

  const largestSize = (colorWheelSize * Math.sqrt(2)) - ModifierBoxBorder;

  ModifierBox.height = largestSize - ModifierBoxPadding;
  ModifierBox.width = largestSize - ModifierBoxPadding;

  ModifierBoxCursor.height = ModifierBox.height;
  ModifierBoxCursor.width = ModifierBox.width;

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
}

const ModifierBoxCursorWidth = 8;
const ModifierBoxCursorStroke = 3;

function DrawModifierBoxCursor() {
  const ctxCursorBox = ModifierBoxCursor.getContext("2d");
  const ctxBoxSize = ModifierBoxCursor.getBoundingClientRect();

  ctxCursorBox.clearRect(0, 0, ctxBoxSize.width, ctxBoxSize.height);

  ctxCursorBox.beginPath();

  let border = ModifierBoxBorder / 2

  ctxCursorBox.rect(
    ((ctxBoxSize.width - ModifierBoxBorder - ModifierBoxCursorWidth) * Saturation) + border + ModifierBoxCursorStroke / 2,
    ((ctxBoxSize.height - ModifierBoxBorder - ModifierBoxCursorWidth) * (1 - ValueOrLightness)) + border + ModifierBoxCursorStroke / 2,
    ModifierBoxCursorWidth - ModifierBoxCursorStroke,
    ModifierBoxCursorWidth - ModifierBoxCursorStroke,
  );

  ctxCursorBox.strokeStyle = "#fffffff0";
  ctxCursorBox.lineWidth = 3;
  ctxCursorBox.stroke();

  ctxCursorBox.strokeStyle = "#000000f0";
  ctxCursorBox.lineWidth = 2;
  ctxCursorBox.stroke();

  ctxCursorBox.fillStyle = arrayTohex(color.fromFunctions[CurrentColorSpace](HueAngle, Saturation, ValueOrLightness));

  ctxCursorBox.fill();
}

function UpdateColorOutput() {
  ColorOutput.style.backgroundColor = arrayTohex(color.fromFunctions[CurrentColorSpace](HueAngle, Saturation, ValueOrLightness));
}

function Update() {
  DrawColorWheel();
  DrawCursor();
  DrawModifierBox();
  DrawModifierBoxCursor();
  UpdateColorOutput();
}

var Mouse = { x: null, y: null }

function GetAngleCursorFromItem(item) {
  const itemBox = item.getBoundingClientRect();
  const itemCenter = { x: itemBox.left + itemBox.width / 2, y: itemBox.top + itemBox.height / 2 };

  return Math.atan2(Mouse.y - itemCenter.y, Mouse.x - itemCenter.x) * (180 / Math.PI);
}


const hueTextOutput = document.getElementById("hueOutput");
const vorlTextOutput = document.getElementById("vorlOutput");
const satTextOutput = document.getElementById("satOutput");

hueTextOutput.value = Math.round(HueAngle);
vorlTextOutput.value = Math.round(ValueOrLightness * 100);
satTextOutput.value = Math.round(Saturation * 100);

function UpdateSandVL() {
  const modifierBoundingBox = ModifierBox.getBoundingClientRect();
  let modifierBoxOneSide = ModifierBoxBorder / 2

  Saturation = Math.round(clamp((Mouse.x - (modifierBoundingBox.x + modifierBoxOneSide)) / (modifierBoundingBox.width - ModifierBoxBorder), 0, 1) * 100) / 100;
  ValueOrLightness = Math.round((1 - clamp((Mouse.y - (modifierBoundingBox.y + modifierBoxOneSide)) / (modifierBoundingBox.height - ModifierBoxBorder), 0, 1)) * 100) / 100;

  vorlTextOutput.value = Math.round(ValueOrLightness * 100);
  satTextOutput.value = Math.round(Saturation * 100);
}

function UpdateHue() {
  HueAngle = Math.round((GetAngleCursorFromItem(ColorWheel) + 90) * 1) / 1;
  HueAngle = HueAngle < 0 ? HueAngle + 360 : HueAngle;

  hueTextOutput.value = Math.round(HueAngle);
}

var MouseDownWheel = false;

function ColorWheelUpdate() {
  if (MouseDownWheel == true) {
    UpdateHue();
    if (HueAngle == HueAngleCache) {
      return
    }

    HueAngleCache = HueAngle
    // ColorDisplay.style.background = new Color(okhsv, [HueAngle, 1, 1]).toString({ format: "hex" });
    DrawCursor();
    DrawModifierBox();
    DrawModifierBoxCursor();
    UpdateColorOutput();
  }
}

hueTextOutput.oninput = function() {
  HueAngle = clamp(hueTextOutput.value, 0, 360);
  Update();
}

hueTextOutput.addEventListener("blur", (event) => {
  HueAngle = clamp(hueTextOutput.value, 0, 360);
  hueTextOutput.value = Math.round(HueAngle);
  Update();
});

hueTextOutput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    HueAngle = clamp(hueTextOutput.value, 0, 360);
    hueTextOutput.value = Math.round(HueAngle);
    Update();
  }
});

vorlTextOutput.oninput = function() {
  ValueOrLightness = clamp(vorlTextOutput.value, 0, 100) / 100;
  Update();
}

vorlTextOutput.addEventListener("blur", (event) => {
  ValueOrLightness = clamp(vorlTextOutput.value, 0, 100) / 100;
  vorlTextOutput.value = Math.round(ValueOrLightness * 100);
  Update();
});

vorlTextOutput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    ValueOrLightness = clamp(vorlTextOutput.value, 0, 100) / 100;
    vorlTextOutput.value = Math.round(ValueOrLightness);
    Update();
  }
});


satTextOutput.oninput = function() {
  Saturation = clamp(satTextOutput.value, 0, 100) / 100;
  Update();
}

satTextOutput.addEventListener("blur", (event) => {
  Saturation = clamp(satTextOutput.value, 0, 100) / 100;
  satTextOutput.value = Math.round(Saturation * 100);
  Update();
});

satTextOutput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    Saturation = clamp(satTextOutput.value, 0, 100) / 100;
    satTextOutput.value = Math.round(Saturation);
    Update();
  }
});

var MouseDownBox = false;

function ModifierBoxUpdate() {
  if (MouseDownBox == true) {
    UpdateSandVL();

    if ((Saturation == SaturationCache) && (ValueOrLightness == ValueOrLightnessCache)) {
      return
    }

    SaturationCache = Saturation;
    ValueOrLightnessCache = ValueOrLightness;

    DrawColorWheel();
    DrawModifierBox();
    DrawModifierBoxCursor();
    UpdateColorOutput();
  }
}

ColorWheel.onmousedown = function(event) {
  Mouse.x = event.clientX ?? event.touches[0].clientX;
  Mouse.y = event.clientY ?? event.touches[0].clientY;

  MouseDownWheel = true;
  ColorWheelUpdate();
}
ColorWheel.addEventListener("touchstart", ColorWheel.onmousedown)

ModifierBoxCursor.onmousedown = function(event) {
  Mouse.x = event.clientX ?? event.touches[0].clientX;
  Mouse.y = event.clientY ?? event.touches[0].clientY;

  MouseDownBox = true;
  ModifierBoxUpdate();
}
ModifierBoxCursor.addEventListener("touchstart", ModifierBoxCursor.onmousedown)

onmouseup = function() {
  MouseDownWheel = false;
  MouseDownBox = false;
  ColorWheelUpdate();
}
ColorWheel.addEventListener("touchend", onmouseup)
ModifierBoxCursor.addEventListener("touchend", onmouseup)

onmousemove = function(event) {
  Mouse.x = event.clientX ?? event.touches[0].clientX;
  Mouse.y = event.clientY ?? event.touches[0].clientY;

  ColorWheelUpdate();
  ModifierBoxUpdate();
}

document.addEventListener("touchmove", onmousemove)

const huePaletteInput = document.getElementById("huePalette");
const satPaletteInput = document.getElementById("satPalette");
const vlPaletteInput = document.getElementById("vlPalette");

const colorPalette = document.getElementById("colorPalette");

function createColorEntry(h, s, vl) {
  let entry = document.createElement("div");
  let entryText = document.createElement("p");

  let requiredColor = arrayTohex(color.fromFunctions[CurrentColorSpace](h, s / 100, vl / 100));

  entryText.innerHTML = requiredColor;
  entryText.style.color = "white";
  entryText.style.textShadow = "0 0 2px black, 1px 1px 0 black,-1px -1px black,-1px 1px black,1px -1px black ";

  entryText.classList.add("hexHoverEffect");

  let entryCopyIcon = document.createElement("p");
  entryCopyIcon.innerHTML = "";
  entryCopyIcon.style.padding = "2";
  entryCopyIcon.style.zIndex = "2";

  entryCopyIcon.style.textShadow = entryText.style.textShadow;

  entryCopyIcon.classList.add("hexHoverEffectCopy");
  entryText.style.margin = "0";

  entry.classList.add("hexEntryCSS");

  entry.appendChild(entryText);
  entry.appendChild(entryCopyIcon);
  entry.style.backgroundColor = requiredColor;
  entry.style.padding = "2px";

  return entry;
}

function GetPalette() {
  let hueOutput = (huePaletteInput.value).trim().split(/\s+/).map(str => str === "" ? NaN : Number(str)).filter(num => !isNaN(num)).map(num => clamp(num, 0, 360));
  let yOutput = (satPaletteInput.value).trim().split(/\s+/).map(str => str === "" ? NaN : Number(str)).filter(num => !isNaN(num)).filter(num => !isNaN(num)).map(num => clamp(num, 0, 100));
  let xOutput = (vlPaletteInput.value).trim().split(/\s+/).map(str => str === "" ? NaN : Number(str)).filter(num => !isNaN(num)).filter(num => !isNaN(num)).map(num => clamp(num, 0, 100));

  colorPalette.innerHTML = '';

  for (let h = 0; h < hueOutput.length; h++) {
    let hueBox = document.createElement("div");
    colorPalette.appendChild(hueBox);

    hueBox.style.display = "grid";
    hueBox.style.gridTemplateColumns = `repeat(${xOutput.length + 1},auto)`;

    hueBox.style.border = "1px solid #fff";

    hueBox.appendChild(createColorEntry(hueOutput[h], 100, 100));

    for (let x = 0; x < xOutput.length; x++) {
      hueBox.appendChild(createColorEntry(hueOutput[h], 100, xOutput[x]));
    }

    for (let y = 0; y < yOutput.length; y++) {
      hueBox.appendChild(createColorEntry(hueOutput[h], yOutput[y], 100));

      for (let x = 0; x < xOutput.length; x++) {
        hueBox.appendChild(createColorEntry(hueOutput[h], yOutput[y], xOutput[x]));
      }
    }
  }
}

huePaletteInput.oninput = GetPalette;
satPaletteInput.oninput = GetPalette;
vlPaletteInput.oninput = GetPalette;

document.getElementById("randomButton").addEventListener("click", function() {
  HueAngle = Math.random() * 360;
  Saturation = Math.random();
  ValueOrLightness = Math.random();

  DrawColorWheel();
  DrawModifierBox();
  UpdateColorOutput();

  DrawCursor();
  DrawModifierBoxCursor();

  GetPalette();
})

document.querySelectorAll('input[name="colorOption"]').forEach(option => {
  option.addEventListener('change', (event) => {
    const convertedColorSpace = color.convertColorSpace(CurrentColorSpace, HueAngle, Saturation, ValueOrLightness, event.target.value);

    if (document.getElementById("colorLockToggle").checked == false) {
      HueAngle = convertedColorSpace[0] * 360;
      Saturation = convertedColorSpace[1];
      ValueOrLightness = convertedColorSpace[2];
    }

    CurrentColorSpace = event.target.value;

    hueTextOutput.value = Math.round(HueAngle);
    vorlTextOutput.value = Math.round(ValueOrLightness * 100);
    satTextOutput.value = Math.round(Saturation * 100);

    DrawColorWheel();
    DrawModifierBox();
    UpdateColorOutput();

    DrawCursor();
    DrawModifierBoxCursor();

    GetPalette();
  })
})

Update();

GetPalette();
