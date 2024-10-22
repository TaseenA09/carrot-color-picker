import Color from '/color.js-main/color.js';
import { clamp } from '/color.js-main/src/util.js';

var CurrentColorSpace = document.querySelector('input[name="colorOption"]:checked').value

var hue = Math.floor(Math.random() * 361);
var sat = Math.floor(Math.random() * 100)/100;
var vorl = Math.floor(Math.random() * 100)/100;

var locked = false
var satVorlSwitch = 1

var colorOutput = document.getElementById("colorOutput")

function updateColor() {
    colorOutput.style.background = new Color(CurrentColorSpace, [hue, sat*satVorlSwitch, vorl*satVorlSwitch]).to("srgb").toString({ format: "hex" });
}


var slider = document.getElementById("range1");
var output = document.getElementById("hueOutput");
output.value = parseFloat(slider.value).toFixed(2);

var hueColor = []

slider.value = hue

function updateHueSliderBackground() {
    hueColor = []
    for (let i = 0; i <= slider.clientWidth; i++) {
        hueColor[i] = new Color(CurrentColorSpace, [(i/slider.clientWidth)*360, sat*satVorlSwitch, vorl*satVorlSwitch]).to("srgb").toString({ format: "hex" });;
    }

    slider.style.background = `linear-gradient(to right, ${hueColor.join(', ')})`;
    updateSatSliderBackground()
}

var slider2 = document.getElementById("range2");
var output2 = document.getElementById("satOutput");
output2.value = parseFloat(slider.value).toFixed(2);


slider2.value = sat*100

var hueColor2 = []

function updateSatSliderBackground() {
    hueColor2 = []
    for (let i = 0; i <= slider.clientWidth; i++) {
        hueColor2[i] = new Color(CurrentColorSpace, [hue, i/slider.clientWidth*satVorlSwitch, vorl*satVorlSwitch]).to("srgb").toString({ format: "hex" });;
    }

    slider2.style.background = `linear-gradient(to right, ${hueColor2.join(', ')})`;
}

var slider3 = document.getElementById("range3");
var output3 = document.getElementById("vorlOutput");
output3.value = parseFloat(slider3.value).toFixed(2);

slider3.value = vorl*100

var hexOutput = document.getElementById("hexOutput")

function updateHexOutput() {
    hexOutput.value = new Color(CurrentColorSpace, [hue, sat*satVorlSwitch, vorl*satVorlSwitch]).to("srgb").toString({ format: "hex", collapse: false });
}

var hueColor3 = []

function updateVorLSliderBackground() {
    hueColor3 = []
    for (let i = 0; i <= slider.clientWidth; i++) {
        hueColor3[i] = new Color(CurrentColorSpace, [hue, sat*satVorlSwitch, i/slider.clientWidth*satVorlSwitch]).to("srgb").toString({ format: "hex" });
    }

    slider3.style.background = `linear-gradient(to right, ${hueColor3.join(', ')})`;
}

function updateThumbColors() {
    updateHexOutput()
    slider.style.setProperty('--hue-color', new Color(CurrentColorSpace, [hue, 1*satVorlSwitch, ((CurrentColorSpace == "okhsl" || CurrentColorSpace == "hsl") ? 0.5 : 1) *satVorlSwitch ]).to("srgb").toString({ format: "hex" }));
    slider2.style.setProperty('--sat-color', new Color(CurrentColorSpace, [hue, sat*satVorlSwitch, ((CurrentColorSpace == "okhsl" || CurrentColorSpace == "hsl") ? 0.5 : 1)*satVorlSwitch]).to("srgb").toString({ format: "hex" }));
    slider3.style.setProperty('--vorl-color', new Color(CurrentColorSpace, [hue, 1*satVorlSwitch, vorl*satVorlSwitch]).to("srgb").toString({ format: "hex" }));
}

function updateSlider1() {
    hue = (slider.value/slider.max)*360;
    output.value = parseFloat(slider.value).toFixed(2);

    updateThumbColors()
    updateColor()
    updateVorLSliderBackground()
    updateSatSliderBackground()
}

slider.oninput = updateSlider1

function updateSlider2() {
    sat = slider2.value/slider2.max;
    output2.value = parseFloat(slider2.value).toFixed(2);

    updateThumbColors()
    updateColor()
    updateVorLSliderBackground()
    updateHueSliderBackground()
}

slider2.oninput = updateSlider2

function updateSlider3() {
    vorl = slider3.value/slider3.max;
    output3.value = parseFloat(slider3.value).toFixed(2);

    updateThumbColors()

    updateColor()
    updateHueSliderBackground()
    updateSatSliderBackground()
}

slider3.oninput = updateSlider3

function updateSlidersFromValues() {
    slider.value = hue
    slider2.value = sat*(100)
    slider3.value = vorl*(100)
}

function updateOutputNumber() {
    updateHueSliderBackground();
    updateSatSliderBackground();
    updateVorLSliderBackground();
    updateColor();
    updateThumbColors();
}

function updateEveryThing() {
    updateOutputNumber();
    updateSlider3();
    updateSlider1();
    updateSlider2();
}

const colorOptions = document.querySelectorAll('input[name="colorOption"]');

function updateSliderFromHex() {
    if ((/^#([0-9A-F]{6}|[0-9A-F]{3})$/i.test(hexOutput.value)) == false) {
        if ((/^#([0-9A-F]{6}|[0-9A-F]{3})$/i.test(`#${hexOutput.value}`)) == false) {
            hexOutput.value = "#ffffff"
        } else{
            hexOutput.value = `#${hexOutput.value}`
        }
    }

    var colorHex = new Color(hexOutput.value)
    
    var colorFromHex = colorHex.to(CurrentColorSpace)

    hue = colorFromHex.h;
    sat = colorFromHex.s/satVorlSwitch;
    vorl = (colorFromHex.v != null ? colorFromHex.v : colorFromHex.l)/satVorlSwitch;

    hexOutput.value = colorHex.toString({ format: "hex", collapse: false })

    updateSlidersFromValues()
    updateEveryThing()
}

hexOutput.addEventListener("change", updateSliderFromHex)

function handleChange() {
    var newColorSpace = document.querySelector('input[name="colorOption"]:checked').value;

    var colorSwitch = new Color(CurrentColorSpace, [hue,sat*satVorlSwitch, vorl*satVorlSwitch]).to(newColorSpace)

    CurrentColorSpace = newColorSpace
    
    if (CurrentColorSpace == "hsv" || CurrentColorSpace == "hsl") {
        satVorlSwitch = 100
    } else {
        satVorlSwitch = 1
    }

    if (locked == false) {
        hue = colorSwitch.h;
        sat = colorSwitch.s/satVorlSwitch;
        vorl = (colorSwitch.v != null ? colorSwitch.v : colorSwitch.l)/satVorlSwitch;
    }

    updateSlidersFromValues()
    updateEveryThing()
}

output.oninput = function() {
    slider.value = output.value
    updateOutputNumber()
}

output.addEventListener("change", (event) => {
    output.value = clamp(0, output.value,slider.max)
    updateEveryThing()
})

output2.oninput = function() {
    slider2.value = output2.value
    updateOutputNumber()
}

output2.addEventListener("change", (event) => {
    output2.value = clamp(0, output2.value,slider2.max)
    updateEveryThing()
})

output3.oninput = function() {
    slider3.value = output3.value
    updateOutputNumber()
}

output3.addEventListener("change", (event) => {
    output3.value = clamp(0, output3.value,slider3.max)
    updateEveryThing()
})

colorOptions.forEach(option => {
    option.addEventListener('change', handleChange);
});

var lockToggle = document.getElementById("colorLockToggle")

lockToggle.oninput = function() {
    locked = this.checked
}

var randomButton = document.getElementById("randomButton")

randomButton.onclick = function() {
    hue = Math.floor(Math.random() * 361);
    sat = Math.floor(Math.random() * 100)/100;
    vorl = Math.floor(Math.random() * 100)/100;

    updateSlidersFromValues()
    updateEveryThing()
}

document.addEventListener('DOMContentLoaded', updateEveryThing);

const copyButton = document.getElementById('copyButton');

copyButton.onclick = function() {
    navigator.clipboard.writeText(hexOutput.value);
}

window.onresize = () => {updateSatSliderBackground(); updateHueSliderBackground(); updateVorLSliderBackground();}