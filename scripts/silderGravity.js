const gravitySlider = document.getElementById('gravitySlider');
const earthTick = document.getElementById('earthTick');
const marsTick = document.getElementById('marsTick');
const moonTick = document.getElementById('moonTick');
const sliderEarth = document.getElementById('sliderEarth');
const sliderMoon = document.getElementById('sliderMoon');
const sliderMars = document.getElementById('sliderMars');
const gravitySliderContainer = document.getElementById('gravitySliderContainer');


gravitySlider.addEventListener("input", function(){
    // earthTick.style.transform = "translateY(50%)";
    // marsTick.style.transform = "translateY(-85%)";
    // moonTick.style.transform = "translateY(50%)";
    // sliderEarth.style.transform = "scale(0.65)";
    // sliderMoon.style.transform = "scale(0.65)";
    // sliderMars.style.transform = "scale(0.65)";
    gravitySliderContainer.style.setProperty('--earthTransform', "scale(0.65)");
    gravitySliderContainer.style.setProperty('--moonTransform', 'scale(0.65) translateX(-10%)');
    gravitySliderContainer.style.setProperty('--marsTransform', 'scale(0.65) translateX(+26%)');


    if (this.value == 981){
        gravitySlider.style.setProperty('--thumbTransform', "rotate(45deg) scale(0.75)");
        gravitySlider.style.setProperty('--thumbBorderRad', "10%");
        gravitySliderContainer.style.setProperty('--earthTransform', "scale(1) translateX(+10%)");
        // earthTick.style.transform = "translateY(10%)";
        //gravitySliderPlanet.setProperty('--earthTransform', 'scale(1)');
    }
    else if (this.value == 371){
        gravitySlider.style.setProperty('--thumbTransform', "rotate(45deg) scale(0.75)");
        gravitySlider.style.setProperty('--thumbBorderRad', "10%");
        gravitySliderContainer.style.setProperty('--marsTransform', "scale(1) translateX(+30%)");
        // marsTick.style.transform = "translateY(-40%)";
    }
    else if (this.value == 162){
        gravitySlider.style.setProperty('--thumbTransform', "rotate(45deg) scale(0.75)");
        gravitySlider.style.setProperty('--thumbBorderRad', "10%");
        gravitySliderContainer.style.setProperty('--moonTransform', "scale(1) translateX(+5%)");
        // moonTick.style.transform = "translateY(10%)";
    }
    else{
        gravitySlider.style.setProperty('--thumbTransform', "rotate(0deg) scale(1)");
        gravitySlider.style.setProperty('--thumbBorderRad', "30%");
    }
})