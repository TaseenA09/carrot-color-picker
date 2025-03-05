import { color, arrayTohex, clamp, hexToArray } from "./colorFunctions/main.js";

let CurrentColorSpace = (document.querySelector('input[name="ColorOption"]:checked') || { value: "okhsv" }).value;

function UpdateButtonsFromColorSpace() {
  document.querySelectorAll('input[name="ColorOption"]').forEach(option => {
    option.checked = option.value == CurrentColorSpace;
  })
}

UpdateButtonsFromColorSpace();

let startingValue = color.toFunctions[CurrentColorSpace](...hexToArray(window.location.hash));

const ColorWheel = document.getElementById("ColorWheel");
const ctxColorWheel = ColorWheel.getContext("2d");

ctxColorWheel.imageSmoothingEnabled = true;
ctxColorWheel.imageSmoothingQuality = 'high';

const ColorWheelWidth = 0.055;

const ModifierBox = document.getElementById("ModifierBox");
const ModifierBoxCursor = document.getElementById("ModifierBoxCursor");

const CursorCanvas = document.getElementById("ColorWheelCursor");

const ColorOutput = document.getElementById("ColorDisplay");

const PaletteButton = document.getElementById("PaletteButton");
const ColorSelector = document.getElementsByClassName("ColorSelector")[0];
const ColorPalette = document.getElementsByClassName("ColorPaletteWraper")[0];

const HexOutput = document.getElementById("HexOutput");

var HueAngle = startingValue[0] * 360 || Math.random() * 360;
var HueAngleCache = -1;

var Saturation = startingValue[1] || Math.random();
var ValueOrLightness = startingValue[2] || Math.random();

var SaturationCache = Saturation;
var ValueOrLightnessCache = ValueOrLightness;

const ColorWheelMaxSize = 500;

const DrawTimeOut = 5;

//ColorWheel.style.maxWidth = ColorWheelMaxSize + "px";
//ColorWheel.style.maxHeight = ColorWheelMaxSize + "px";

//CursorCanvas.style.maxWidth = ColorWheel.style.maxWidth;
//CursorCanvas.style.maxHeight = ColorWheel.style.maxHeight;

function DrawColorWheel(timeoutTime) {
  timeoutTime = isNaN(timeoutTime) ? DrawTimeOut : timeoutTime;
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

function GetUnitFromAngle(angle) {
  return {
    x: Math.sin(-(angle + 180) * Math.PI / 180),
    y: Math.cos((angle + 180) * Math.PI / 180)
  };
}

const WheelCursorSize = 0.1;
const WheelCursorGap = 0.1;

function DrawCursor() {
  if (ColorSelector.style.display == "none") {
    return
  }

  const ctxCursor = CursorCanvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  ctxCursor.clearRect(0, 0, CursorCanvas.width, CursorCanvas.height);

  ctxCursor.beginPath();

  const colorWheelBoundingBox = CursorCanvas.getBoundingClientRect();
  const colorWheelSize = (Math.min(colorWheelBoundingBox.width, colorWheelBoundingBox.height) / 2) - 20;
  const colorWheelCenter = {
    x: colorWheelBoundingBox.width / 2,
    y: colorWheelBoundingBox.height / 2
  };

  CursorCanvas.height = colorWheelBoundingBox.height * dpr;
  CursorCanvas.width = colorWheelBoundingBox.width * dpr;

  ctxCursor.scale(dpr, dpr);

  const colorWidth = ColorWheelWidth * Math.min(colorWheelBoundingBox.height, colorWheelBoundingBox.width);

  let cursorUnit = GetUnitFromAngle(HueAngle);


  // ctxCursor.moveTo((colorWheelCenter.x) + (cursorUnit.x * (colorWheelSize - WheelCursorGap * colorWidth)), (colorWheelCenter.y) + (cursorUnit.y * (colorWheelSize - WheelCursorGap * colorWidth)));

  const wheelSize = WheelCursorSize * colorWidth

  ctxCursor.arc(colorWheelCenter.x, colorWheelCenter.y, colorWheelSize - ((colorWidth / 2) - 1), ((Math.PI / 180) * (HueAngle - 90 + wheelSize)), ((Math.PI / 180) * (HueAngle - 90 - wheelSize)), true)

  //  ctxCursor.arc(colorWheelCenter.x, colorWheelCenter.y, colorWheelSize + ((colorWidth / 2) - 1), ((Math.PI / 180) * (HueAngle - 90 - wheelSize)), ((Math.PI / 180) * (HueAngle - 90 + wheelSize)), false)

  // ctxCursor.closePath();

  // ctxColorWheel.arc((colorWheelCenter.x) + (Math.sin(-(HueAngle + 180) * Math.PI / 180) * colorWheelSize), (colorWheelCenter.y) + (Math.cos((HueAngle + 180) * Math.PI / 180) * colorWheelSize), 15, 0, Math.PI * 2);

  //ctxCursor.moveTo((colorWheelCenter.x) + (cursorUnit.x * (colorWheelSize + WheelCursorGap * colorWidth)), (colorWheelCenter.y) + (cursorUnit.y * (colorWheelSize + WheelCursorGap * colorWidth)));
  ctxCursor.arc(colorWheelCenter.x, colorWheelCenter.y, colorWheelSize + ((colorWidth / 2) - 1), ((Math.PI / 180) * (HueAngle - 90 - wheelSize)), ((Math.PI / 180) * (HueAngle - 90 + wheelSize)), false)
  ctxCursor.closePath();

  ctxCursor.lineWidth = 6 / dpr;
  ctxCursor.strokeStyle = "#000000a0";

  ctxCursor.stroke();

  ctxCursor.strokeStyle = "#ffffffa0";

  ctxCursor.lineWidth = 3 / dpr;

  ctxCursor.stroke();

  ctxCursor.fillStyle = arrayTohex(color.fromFunctions[CurrentColorSpace.slice(0, -1) + "v"](HueAngle, 1, 1));

  ctxCursor.fill();

}

const ModifierBoxPadding = 8;
const ModifierBoxBorder = 4;

function DrawModifierBox(timeoutTime) {
  timeoutTime = isNaN(timeoutTime) ? DrawTimeOut : timeoutTime;
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

const ModifierBoxCursorWidth = 0.1;
const ModifierBoxCursorStroke = 4;

function DrawModifierBoxCursor() {
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

let TimeoutsArray = []
let TimeoutOverflowArray = []

const TimeoutOverflowMax = 15;

function DoTimeout(TimeoutId, funtionToDo, timeToWait) {
  TimeoutOverflowArray[TimeoutId] = isNaN(TimeoutOverflowArray[TimeoutId]) ? 0 : TimeoutOverflowArray[TimeoutId];

  clearTimeout(TimeoutsArray[TimeoutId]);

  if (TimeoutOverflowArray[TimeoutId] >= TimeoutOverflowMax || timeToWait == 0) {
    funtionToDo();
    TimeoutOverflowArray[TimeoutId] = 0;
  } else {
    TimeoutsArray[TimeoutId] = setTimeout(() => { funtionToDo(); TimeoutOverflowArray[TimeoutId] = 0; }, timeToWait);
  }

  TimeoutOverflowArray[TimeoutId] += 1;
}


const VLOutputLabel = document.querySelector('label[for="VLOutput"]');
const VLPaletteLabel = document.querySelector('label[for="VLPalette"]');

let outputTick = 0;
let hashTimeout;

function UpdateColorOutput() {
  const requiredColor = arrayTohex(color.fromFunctions[CurrentColorSpace](HueAngle, Saturation, ValueOrLightness));

  clearTimeout(hashTimeout);
  hashTimeout = setTimeout(() => {
    history.replaceState(null, null, `${requiredColor}`);
    outputTick = 0;
  }, 15);

  outputTick += 1;

  if (outputTick > 15) {
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


function Update(timeoutTime) {
  timeoutTime = isNaN(timeoutTime) ? DrawTimeOut : timeoutTime;
  DoTimeout("UniversalUpdate", () => {
    DrawColorWheel();
    DrawCursor();
    DrawModifierBox();
    DrawModifierBoxCursor();
    UpdateColorOutput();
  }, timeoutTime);
}

var Mouse = { x: null, y: null }

function GetAngleCursorFromItem(item) {
  const itemBox = item.getBoundingClientRect();
  const itemCenter = { x: itemBox.left + itemBox.width / 2, y: itemBox.top + itemBox.height / 2 };

  return Math.atan2(Mouse.y - itemCenter.y, Mouse.x - itemCenter.x) * (180 / Math.PI);
}


const hueTextOutput = document.getElementById("HueOutput");
const vlTextOutput = document.getElementById("VLOutput");
const satTextOutput = document.getElementById("SaturationOutput");

hueTextOutput.value = Math.round(HueAngle);
vlTextOutput.value = Math.round(ValueOrLightness * 100);
satTextOutput.value = Math.round(Saturation * 100);

function UpdateSandVL() {
  const modifierBoundingBox = ModifierBox.getBoundingClientRect();
  let modifierBoxOneSide = ModifierBoxBorder / 2

  Saturation = Math.round(clamp((Mouse.x - (modifierBoundingBox.x + modifierBoxOneSide)) / (modifierBoundingBox.width - ModifierBoxBorder), 0, 1) * 100) / 100;
  ValueOrLightness = Math.round((1 - clamp((Mouse.y - (modifierBoundingBox.y + modifierBoxOneSide)) / (modifierBoundingBox.height - ModifierBoxBorder), 0, 1)) * 100) / 100;

  vlTextOutput.value = Math.round(ValueOrLightness * 100);
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
vlTextOutput.oninput = function() {
  ValueOrLightness = clamp(vlTextOutput.value, 0, 100) / 100;
  Update();
}
satTextOutput.oninput = function() {
  Saturation = clamp(satTextOutput.value, 0, 100) / 100;
  Update();
}

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

ModifierBox.onmousedown = function(event) {
  Mouse.x = event.clientX ?? event.touches[0].clientX;
  Mouse.y = event.clientY ?? event.touches[0].clientY;

  MouseDownBox = true;
  ModifierBoxUpdate();
}
ModifierBox.addEventListener("touchstart", ModifierBox.onmousedown)

onmouseup = function() {
  MouseDownWheel = false;
  MouseDownBox = false;
  ColorWheelUpdate();
}

ColorWheel.addEventListener("touchend", onmouseup)
ModifierBox.addEventListener("touchend", onmouseup)

onmousemove = function(event) {
  Mouse.x = event.clientX ?? event.touches[0].clientX;
  Mouse.y = event.clientY ?? event.touches[0].clientY;

  ColorWheelUpdate();
  ModifierBoxUpdate();
}

document.addEventListener("touchmove", onmousemove)

const huePaletteInput = document.getElementById("huePalette");
const satPaletteInput = document.getElementById("satPalette");
const VLPaletteInput = document.getElementById("VLPalette");

const colorPalette = document.getElementById("colorPalette");

function createColorEntry(h, s, vl, c, r) {
  let entry = document.createElement("div");
  let entryText = document.createElement("p");

  entry.classList.add("interactable");

  var c = c == undefined ? '' : c.toString();
  var r = r == undefined ? '' : r.toString();

  const isOs = ("ontouchend" in document)

  let requiredColor = arrayTohex(color.fromFunctions[CurrentColorSpace](h, s / 100, vl / 100));

  entryText.innerHTML = requiredColor;

  let entryCopyIcon;
  if (!isOs) {
    entryCopyIcon = document.createElement("p");
    entryCopyIcon.innerHTML = c.length + r.length <= 3 ? "Copy" + " " + c + ":" + r : c + ":" + r;

    entryCopyIcon.style.padding = "2";
    entryCopyIcon.style.zIndex = "2";

    entryCopyIcon.style.textShadow = entryText.style.textShadow;

    entryCopyIcon.classList.add("hexHoverEffectCopy");
    entryText.classList.add("hexHoverEffect");
    entryText.classList.add("hexHoverEffectText");
  } else {
    entryText.classList.add("hexHoverEffectText");
    entryText.style.margin = "auto";
    entryText.style.width = "100%";
    entryText.style.height = "100%";
    entryText.style.userSelect = "all";
  }

  entryText.style.margin = "0";
  entry.classList.add("hexEntryCSS");
  entry.appendChild(entryText);

  if (!isOs) {
    entry.appendChild(entryCopyIcon);
  }

  entry.style.backgroundColor = requiredColor;
  entry.style.padding = "2px";

  entry.onclick = () => navigator.clipboard.writeText(requiredColor);

  return entry;
}

function GetPalette() {
  let hueOutput = (huePaletteInput.value).trim().split(/\s+/).map(str => str === "" ? NaN : Number(str)).filter(num => !isNaN(num)).map(num => clamp(num, 0, 360));
  let yOutput = (satPaletteInput.value).trim().split(/\s+/).map(str => str === "" ? NaN : Number(str)).filter(num => !isNaN(num)).filter(num => !isNaN(num)).map(num => clamp(num, 0, 100));
  let xOutput = (VLPaletteInput.value).trim().split(/\s+/).map(str => str === "" ? NaN : Number(str)).filter(num => !isNaN(num)).filter(num => !isNaN(num)).map(num => clamp(num, 0, 100))

  colorPalette.innerHTML = '';

  for (let h = 0; h < hueOutput.length; h++) {
    let hueBox = document.createElement("div");
    colorPalette.appendChild(hueBox);

    hueBox.style.display = "grid";
    hueBox.style.gridTemplateColumns = `repeat(${xOutput.length + 1},auto)`;

    hueBox.classList.add("paletteHueBox");
    hueBox.classList.add("outlined");

    hueBox.appendChild(createColorEntry(hueOutput[h], 100, 100, 0, 0));

    for (let x = 0; x < xOutput.length; x++) {
      hueBox.appendChild(createColorEntry(hueOutput[h], 100, xOutput[x], 0, x + 1));
    }

    for (let y = 0; y < yOutput.length; y++) {
      hueBox.appendChild(createColorEntry(hueOutput[h], yOutput[y], 100, y + 1, 0));

      for (let x = 0; x < xOutput.length; x++) {
        hueBox.appendChild(createColorEntry(hueOutput[h], yOutput[y], xOutput[x], y + 1, x + 1));
      }
    }
  }
}

huePaletteInput.oninput = GetPalette;
satPaletteInput.oninput = GetPalette;
VLPaletteInput.oninput = GetPalette;

document.getElementById("randomButton").addEventListener("click", function() {
  HueAngle = Math.random() * 360;
  Saturation = Math.random();
  ValueOrLightness = Math.random();

  Update();

  GetPalette();
})

HexOutput.addEventListener("change", function() {
  let requiredColor = color.toFunctions[CurrentColorSpace](...hexToArray(HexOutput.value));

  HueAngle = requiredColor[0] * 360;
  Saturation = requiredColor[1];
  ValueOrLightness = requiredColor[2];

  Update();
})

document.querySelectorAll('input[name="ColorOption"]').forEach(option => {
  option.addEventListener('change', (event) => {
    const convertedColorSpace = color.convertColorSpace(CurrentColorSpace, HueAngle, Saturation, ValueOrLightness, event.target.value);

    if (document.getElementById("colorLockToggle").checked == false) {
      HueAngle = convertedColorSpace[0] * 360;
      Saturation = convertedColorSpace[1];
      ValueOrLightness = convertedColorSpace[2];
    }

    CurrentColorSpace = event.target.value;

    hueTextOutput.value = Math.round(HueAngle);
    vlTextOutput.value = Math.round(ValueOrLightness * 100);
    satTextOutput.value = Math.round(Saturation * 100);

    Update();

    GetPalette();
  })
})

document.getElementById("CopyButton").onclick = function() {
  navigator.clipboard.writeText(HexOutput.value);
}

Update(0);
GetPalette();


function UpdatePaletteVisibilty() {
  if (window.innerWidth < 700) {
    if (PaletteButton.checked) {
      ColorPalette.style.display = 'flex';
      ColorSelector.style.display = 'none';
    } else {
      ColorPalette.style.display = 'none';
      ColorSelector.style.display = 'flex';
    }
  } else {
    ColorPalette.style.display = 'flex';
    ColorSelector.style.display = 'flex';
  }

  Update();
}

PaletteButton.addEventListener('change', UpdatePaletteVisibilty);
UpdatePaletteVisibilty();

onresize = () => {
  Update(0);
  UpdatePaletteVisibilty();
};



document.addEventListener("DOMContentLoaded", function() {
  Update(0);
});

window.addEventListener("load", function() {
  Update(0);
  this.requestAnimationFrame(Update);
  setTimeout(Update, 150);
  setTimeout(DrawModifierBoxCursor, 150);
  setTimeout(DrawCursor, 150);
});


const DownloadButton = document.getElementById("downloadButton");
const IndexOrValueMode = document.getElementById("indexButton");

function CreatePaletteJSON() {
  const hueOutput = (huePaletteInput.value).trim().split(/\s+/).map(str => str === "" ? NaN : Number(str)).filter(num => !isNaN(num)).map(num => clamp(num, 0, 360));
  const yOutput = (satPaletteInput.value).trim().split(/\s+/).map(str => str === "" ? NaN : Number(str)).filter(num => !isNaN(num)).map(num => clamp(num, 0, 100));
  const xOutput = (VLPaletteInput.value).trim().split(/\s+/).map(str => str === "" ? NaN : Number(str)).filter(num => !isNaN(num)).map(num => clamp(num, 0, 100))

  function getRequiredColor(h, s, vl) {
    return arrayTohex(color.fromFunctions[CurrentColorSpace](h, s / 100, vl / 100));
  }

  const indexMode = IndexOrValueMode.checked;

  let data = {
    type: CurrentColorSpace,
    formatting: indexMode ? "index" : "value"
  };


  for (let h = 0; h < hueOutput.length; h++) {
    data[hueOutput[h]] = {}

    if (indexMode == true) {
      data[hueOutput[h]][0] = {}
      data[hueOutput[h]][0][0] = getRequiredColor(hueOutput[h], 100, 100);
    } else {
      data[hueOutput[h]][100] = {}
      data[hueOutput[h]][100][100] = getRequiredColor(hueOutput[h], 100, 100);
    }
    for (let x = 0; x < xOutput.length; x++) {
      if (indexMode == true) {
        data[hueOutput[h]][0][x + 1] = getRequiredColor(hueOutput[h], 100, xOutput[x]);
      } else {
        data[hueOutput[h]][100][xOutput[x]] = getRequiredColor(hueOutput[h], 100, xOutput[x]);
      }
    }

    for (let y = 0; y < yOutput.length; y++) {
      if (indexMode == true) {
        data[hueOutput[h]][y + 1] = {}
        data[hueOutput[h]][y + 1][0] = getRequiredColor(hueOutput[h], yOutput[y], 100);
      } else {
        data[hueOutput[h]][yOutput[y]] = {}
        data[hueOutput[h]][yOutput[y]][100] = getRequiredColor(hueOutput[h], yOutput[y], 100);
      }

      for (let x = 0; x < xOutput.length; x++) {
        if (indexMode == true) {
          data[hueOutput[h]][y + 1][x + 1] = getRequiredColor(hueOutput[h], yOutput[y], xOutput[x]);
        } else {
          data[hueOutput[h]][yOutput[y]][xOutput[x]] = getRequiredColor(hueOutput[h], yOutput[y], xOutput[x]);
        }
      }
    }
  }

  return data;
}

DownloadButton.addEventListener("click", function() {
  const json = CreatePaletteJSON();
  const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "colors.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// File Processing

function ProcessFile(json) {
  if (json["type"] == undefined) {
    return
  }

  if (document.getElementById("colorLockToggle").checked == false) {
    console.log(json["type"]);
    CurrentColorSpace = json["type"];
    UpdateButtonsFromColorSpace();
  }

  let hue = [];
  let saturation = [];
  let valueorlightness = [];

  for (const h in json) {
    if (isNaN(Number(h))) {
      continue
    }

    hue.push(h);
  }


  if (json["formatting"] == "value") {
    for (const s in json[hue[0]]) {
      if (s == "100") {
        continue
      }
      saturation.unshift(s);
    }
    for (const vl in json[hue[0]][saturation[0]]) {
      if (vl == "100") {
        continue
      }
      valueorlightness.unshift(vl);
    }
  }

  if (json["formatting"] == "index") {
    for (const s in json[hue[0]]) {
      const requiredValue = Math.round(color.toFunctions[CurrentColorSpace](...hexToArray(json[hue[0]][s][Object.keys(json[hue[0]][s])[0]]))[1] * 100);
      if (requiredValue == 100) {
        continue
      }
      saturation.push(requiredValue);
    }

    let firstSatKey = Object.keys(json[hue[0]])[0]

    for (const vl in json[hue[0]][firstSatKey]) {
      let requiredValue = Math.round(color.toFunctions[CurrentColorSpace](...hexToArray(json[hue[0]][firstSatKey][vl]))[2] * 100);

      if (requiredValue == 100) {
        continue
      }
      valueorlightness.push(requiredValue);
    }
  }

  huePaletteInput.value = hue.join(" ");
  satPaletteInput.value = saturation.join(" ");
  VLPaletteInput.value = valueorlightness.join(" ");

  GetPalette();
  Update();
}

const ImportButton = document.getElementById("importButton");

ImportButton.addEventListener("change", input => {
  const file = input.target.files[0];

  if (file.type != "application/json") {
    return
  }

  file.text().then(content => {
    ProcessFile(JSON.parse(content));
  });
});


window.addEventListener("beforeunload", (event) => {
  event.preventDefault();

  event.returnValue = true;
});

Update(0);
