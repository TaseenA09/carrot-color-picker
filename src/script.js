import { color, arrayTohex, clamp, hexToArray } from "./colorFunctions/main.js";
import { DoTimeout } from "./scripts/helperFunctions/main.js";

const PaletteButton = document.getElementById("PaletteButton");
const ColorPalette = document.getElementsByClassName("ColorPaletteWraper")[0];

function Update(timeoutTime) {
  timeoutTime = isNaN(timeoutTime) ? DrawTimeOut : timeoutTime;
  DoTimeout("UniversalUpdate", () => {
    DrawListPalette();
    UpdateColorOutput();
  }, timeoutTime);
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
    hueBox.classList.add("rounded");

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
  Saturation = isNaN(requiredColor[1]) ? 0 : requiredColor[1];
  ValueOrLightness = isNaN(requiredColor[2]) ? 0 : requiredColor[2];

  Update();
  UpdateTextOutputs();
})

function UpdateTextOutputs() {
  hueTextOutput.value = roundValue(HueAngle);
  vlTextOutput.value = roundValue(ValueOrLightness * 100);
  satTextOutput.value = roundValue(Saturation * 100);
}

document.querySelectorAll('input[name="ColorOption"]').forEach(option => {
  option.addEventListener('change', (event) => {
    const convertedColorSpace = color.convertColorSpace(CurrentColorSpace, HueAngle, Saturation, ValueOrLightness, event.target.value);

    if (document.getElementById("colorLockToggle").checked == false) {
      HueAngle = convertedColorSpace[0] * 360;
      Saturation = convertedColorSpace[1];
      ValueOrLightness = convertedColorSpace[2];
    }

    CurrentColorSpace = event.target.value;

    UpdateTextOutputs();

    Update();

    GetPalette();
  })
})

document.getElementById("CopyButton").onclick = function() {
  navigator.clipboard.writeText(HexOutput.value);
}

GetPalette();

function UpdatePaletteVisibilty() {
  if (window.innerWidth <= 700) {
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
  DoTimeout("resize1", Update, 1);
}

PaletteButton.addEventListener('change', UpdatePaletteVisibilty);
UpdatePaletteVisibilty();

onresize = () => {
  Update(0);
  UpdatePaletteVisibilty();
};

const listButton = document.getElementById("list");

const listPalette = document.getElementById("PaletteInputList");
const gridPalette = document.getElementById("ColorPaletteGrid");

const colorPaletteInput = document.getElementById("ColorPaletteInput");

function updateListButton() {
  if (listButton.checked) {
    listPalette.style.display = "flex";
    gridPalette.style.display = "none";

    colorPalette.style.display = "none";
    colorPaletteInput.classList.add("ColorPaletteListInput");
  } else {
    listPalette.style.display = "none";
    gridPalette.style.display = "flex";

    colorPalette.style.display = "flex";
    colorPaletteInput.classList.remove("ColorPaletteListInput");
  }
}

updateListButton()

document.getElementsByName("paletteType").forEach((e) => {
  e.addEventListener('input', updateListButton);
})

document.addEventListener("DOMContentLoaded", function() {
  Update(0);
});

window.addEventListener("load", function() {
  Update(0);
  requestAnimationFrame(Update);
});

var ListPaletteColors = {
  ColorSpace: "OKHSL",
  Colors: [
    {
      Name: "Greyish Blue",
      Colors: [
        {
          Name: "Normal Blue",
          ColorType: "HUE",
          Color: [270, 70, 60]
        },
        {
          Name: "Subnormal Blue",
          ColorType: "HUE",
          Color: [270, 100, 60]
        }

      ]
    },
    {
      Name: "Greyish Blue",
      Colors: []
    }
  ]
}

const PaletteListArea = document.getElementById("paletteList");

function createHTMLElement(type, parent, classname) {
  if ((type == undefined) || (parent == undefined)) {
    return
  }

  var element = document.createElement(type);
  parent.append(element);

  if (classname != undefined) {
    if (Array.isArray(classname)) {
      classname.forEach(_classnametoadd => {
        element.classList.add(_classnametoadd);
      })
    } else {
      element.classList.add(classname);
    }
  }

  return element;
}

function DrawColorItem(_idx, colorGroup, groupColors) {
  var _color = document.createElement("div");

  colorGroup.append(_color);
  _color.classList.add("listColorItem");

  _color.draggable = true;

  let Item = groupColors[_idx];

  if (Item.Name == undefined) {
    Item.Name = "Color"
  }

  if (Item.Color == undefined) {
    Item.Color = [roundValue(Math.random() * 360), roundValue(Math.random() * 100), roundValue(Math.random() * 100)]
    Item.ColorType = "HUE"
  }

  if (Item.ColorType == undefined) {
    Item.ColorType = "HUE"
  }

  var colorName = document.createElement("input");
  colorName.value = Item.Name;
  _color.append(colorName);

  function update_color_name() {
    Item.Name = colorName.value;
  }

  var _addItemAbove = createHTMLElement("button", _color, ["colorItemAddInput", "colorItemAddAbove"])
  var _addItemBelow = createHTMLElement("button", _color, ["colorItemAddInput", "colorItemAddBelow"])

  function addItemToWithOffset(_offset) {
    let color = {};
    color.ColorType = "HUE";
    if ((_idx == 0 && _offset == 0) || (_idx == groupColors.length - 1 && _offset == 1)) {
      color.Color = [
        (Item.Color[0] + 36) % 360,
        Item.Color[1],
        Item.Color[2]
      ]
    } else {
      let itemOffsetSize = -1 + (_offset * 2)

      function lerp(a, b, t) {
        return roundValue(a + (t * (b - a)))
      }

      color.Color = []

      for (let colori = 0; colori < Item.Color.length; colori++) {
        console.log(_idx + itemOffsetSize, _offset)
        color.Color[colori] = lerp(Item.Color[colori], groupColors[_idx + itemOffsetSize].Color[colori], 0.5)
      }
    }
    groupColors.splice(_idx + _offset, 0, color);
    DrawListPalette();
  }

  _addItemAbove.addEventListener("click", () => addItemToWithOffset(0));
  _addItemBelow.addEventListener("click", () => addItemToWithOffset(1));

  colorName.addEventListener("change", update_color_name);
  colorName.addEventListener("blur", update_color_name);

  var colorElements = document.createElement("div");
  _color.append(colorElements);
  colorElements.classList.add("listColorItemElements");

  var colorValues = createHTMLElement("div", colorElements, "colorValuesBox")
  var hueElement = createHTMLElement("input", colorValues, "colorItemElement")
  var satElement = createHTMLElement("input", colorValues, "colorItemElement")
  var valElement = createHTMLElement("input", colorValues, "colorItemElement")
  var hexElement = createHTMLElement("input", colorValues, "colorItemHex")

  function _fixDrag(element) {
    element.onfocus = () => { _color.draggable = false };
    element.onblur = () => { _color.draggable = true };
  }

  _fixDrag(hueElement);
  _fixDrag(satElement);
  _fixDrag(valElement);
  _fixDrag(hexElement);
  _fixDrag(colorName);

  var selectionHueLabel = createHTMLElement("label", colorElements, "colorItemSelectionLabel")
  var selectionHue = createHTMLElement("input", selectionHueLabel, "colorItemSelectionHue")

  selectionHue.type = "checkbox";

  selectionHue.name = "colorItemSelection";

  if (Item.ColorType == "HUE") {
    hueElement.value = Item.Color[0];
    satElement.value = Item.Color[1];
    valElement.value = Item.Color[2];

    hexElement.value = arrayTohex(color.fromFunctions[CurrentColorSpace](Item.Color[0], Item.Color[1] / 100, Item.Color[2] / 100));

    _color.style.backgroundColor = hexElement.value
  } else if (Item.ColorType == "HEX") {
    hexElement.value = Item.Color;

    const _intended_color = hexToArray(Item.Color);

    selectionHue.checked = true;

    const _hsv_color = color.toFunctions[CurrentColorSpace](..._intended_color);

    hueElement.value = roundValue(_hsv_color[0] * 360);
    satElement.value = roundValue(_hsv_color[1] * 100);
    valElement.value = roundValue(_hsv_color[2] * 100);

    _color.style.backgroundColor = hexElement.value
  }

  selectionHue.addEventListener("change", () => {
    if (Item.ColorType == "HUE") {
      hexElement.value = arrayTohex(color.fromFunctions[CurrentColorSpace](hueElement.value, satElement.value / 100, valElement.value / 100));
      Item.Color = hexElement.value;
    } else if (Item.ColorType == "HEX") {
      const _intended_color = hexToArray(hexElement.value);
      const _hsv_color = color.toFunctions[CurrentColorSpace](..._intended_color);

      hueElement.value = roundValue(_hsv_color[0] * 360);
      satElement.value = roundValue(_hsv_color[1] * 100);
      valElement.value = roundValue(_hsv_color[2] * 100);

      Item.Color = [hueElement.value, satElement.value, valElement.value]

      _color.style.backgroundColor = hexElement.value
    }

    Item.ColorType = selectionHue.checked ? "HEX" : "HUE";
  })

  function attachItem(_element, _indexToUpdate, _min, _max) {
    function _updateColorOfItem() {
      if (!(_indexToUpdate == undefined)) {
        if (!Array.isArray(Item.Color)) {
          Item.Color = [];
          Item.Color[0] = hueElement.value;
          Item.Color[1] = satElement.value;
          Item.Color[2] = valElement.value;

          return
        }

        Item.ColorType = "HUE"

        Item.Color[_indexToUpdate] = clamp(_element.value, _min, _max);
        _color.style.backgroundColor = arrayTohex(color.fromFunctions[CurrentColorSpace](Item.Color[0], Item.Color[1] / 100, Item.Color[2] / 100));
      } else {
        Item.ColorType = "HEX"

        Item.Color = arrayTohex(hexToArray(_element.value));
        _color.style.backgroundColor = Item.Color;
      }
    }

    _element.addEventListener("change", _updateColorOfItem)
    _element.addEventListener("blur", _updateColorOfItem)
  }

  attachItem(hueElement, 0, 0, 360);
  attachItem(satElement, 1, 0, 100);
  attachItem(valElement, 2, 0, 100);

  attachItem(hexElement);

  let _moveHighlight = createHTMLElement("div", _color, "colorItemSelectionHighlight")

  let addAbove = false;
  let addMiddle = false;

  function updateDrag(ev) {
    let selfBoudingBox = _color.getBoundingClientRect();
    let yPos = (ev.clientY - selfBoudingBox.y) / selfBoudingBox.height

    _moveHighlight.style.display = "block";

    addMiddle = false;
    _moveHighlight.style.transform = ""
    _moveHighlight.style.width = "100%";
    _moveHighlight.style.height = "45%";
    _moveHighlight.style.left = "";
    _moveHighlight.style.top = "";

    if (yPos < 0.33) {
      _moveHighlight.style.top = 0;
      addAbove = true;
    } else if (yPos > (1 - 0.33)) {
      _moveHighlight.style.top = "100%";
      _moveHighlight.style.transform = "translateY(-100%)"
      addAbove = false;
    } else {
      addMiddle = true;
      _moveHighlight.style.top = "50%";
      _moveHighlight.style.left = "50%";
      _moveHighlight.style.transform = "translate(-50%,-50%)"
      _moveHighlight.style.width = "90%";
      _moveHighlight.style.height = "75%";
    }
  }

  let dragged = false;
  _color.addEventListener('dragstart', (e) => {
    dragged = true;
  });

  _color.addEventListener("dragover", (ev) => {

    if (dragged == true) {
      return
    }

    ev.preventDefault();

    updateDrag(ev);
  })

  _color.addEventListener("dragleave", (ev) => {
    _moveHighlight.style.display = "none"
  })

  document.addEventListener('dragend', (ev) => {
    _moveHighlight.style.display = "none";
    dragged = false;
  })
}

function DrawColorGroup(groupItem) {
  var colorGroup = document.createElement("div");

  PaletteListArea.append(colorGroup);
  colorGroup.classList.add("listColorGroup");

  var colorGroupName = document.createElement("input");
  colorGroupName.value = groupItem.Name || `Group ${ListPaletteColors.Colors.indexOf(groupItem) + 1}`;
  colorGroup.append(colorGroupName);

  function update_colorgroup_name() {
    groupItem.Name = colorGroupName.value;
  }

  colorGroupName.addEventListener("change", update_colorgroup_name);
  colorGroupName.addEventListener("blur", update_colorgroup_name);

  if ((groupItem.Colors == undefined) || groupItem.Colors.length <= 0) {
    var colorGroupAddButton = createHTMLElement("button", colorGroup, "colorGroupAddButton");
    colorGroupAddButton.addEventListener("click", () => {
      SaveColorListGroup();
      groupItem.Colors = [];
      groupItem.Colors.push({});
      DrawListPalette();
    })
    return
  }

  for (let colorIdx = 0; colorIdx < groupItem.Colors.length; colorIdx++) {
    DrawColorItem(colorIdx, colorGroup, groupItem.Colors);
  }
}

function DrawListPalette() {
  PaletteListArea.innerHTML = ""
  listPalette.ColorSpace = CurrentColorSpace;

  if ((ListPaletteColors.Colors == undefined) || ListPaletteColors.Colors.length <= 0) {
    return
  }

  for (let groupIdx = 0; groupIdx < ListPaletteColors.Colors.length; groupIdx++) {
    DrawColorGroup(ListPaletteColors.Colors[groupIdx]);
  }
}

DrawListPalette()

var ColorListGroupUndoList = []

function SaveColorListGroup() {
  ColorListGroupUndoList.push(ListPaletteColors.Colors);
}

function UndoColorListGroup(table) {
  if (ColorListGroupUndoList.length > 0) {
    ListPaletteColors.Colors = ColorListGroupUndoList.pop();
  }
}

const addGroup = document.getElementById("addColorGroupButton");
addGroup.addEventListener("click", () => {
  SaveColorListGroup();
  ListPaletteColors.Colors.push({});
  DrawListPalette();
})

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
      const requiredValue = roundValue(color.toFunctions[CurrentColorSpace](...hexToArray(json[hue[0]][s][Object.keys(json[hue[0]][s])[0]]))[1] * 100);
      if (requiredValue == 100) {
        continue
      }
      saturation.push(requiredValue);
    }

    let firstSatKey = Object.keys(json[hue[0]])[0]

    for (const vl in json[hue[0]][firstSatKey]) {
      let requiredValue = roundValue(color.toFunctions[CurrentColorSpace](...hexToArray(json[hue[0]][firstSatKey][vl]))[2] * 100);

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

// HTML Stuff

function onclickchange(_output, _dif, _min, _max) {
  _output.value = Math.max(Math.min(_output.value + _dif, _max), _min)
}
