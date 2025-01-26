import * as THREE from 'three';
import { drawBackground } from './scripts/background.js';
import {calculateErrorBeaker, calculateErrorHeight, isError} from './scripts/errors.js'
import * as FORCEM from './scripts/forcemeter.js'
//(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()


const canvas = document.querySelector( '#canvas1' );
const container = document.getElementById('container'); //This contains the canvas and ui elements

const increaseHeight = document.getElementById('buttonUp');
const reduceHeight = document.getElementById('buttonDown');
const changeRadius = document.getElementById('radiusSlider');
const massSlider = document.getElementById('massSlider');
const saltSlider = document.getElementById('saltSlider');
const heightSlider = document.getElementById('heightSlider');

//beakerbuttons
const incBeakerHeightBtn = document.getElementById('incHeight');
const decBeakerHeightBtn = document.getElementById('decHeight');
const incBeakerRadiusBtn = document.getElementById('incRadius');
const decBeakerRadiusBtn = document.getElementById('decRadius');
const beakerHeightValue = document.getElementById('beakerHeightValue');
const beakerRadiusValue = document.getElementById('beakerRadiusValue');
//const beakerVolume = document.getElementById('beakerVolume');

//Radio Change Shape
const radioShape = document.querySelectorAll('input[type=radio][name="rShape"]');
//radio for mass or density mode
const radioMass = document.querySelectorAll('input[type=radio][name="tgmass"]');

//texts
const heightText = document.getElementById('heightInfo');
const radiusText = document.getElementById('radiusInfo');
const cText = document.getElementById('cInfo');
const forceText = document.getElementById('forceInfo');
const massText = document.getElementById('massInfo');
const saltText = document.getElementById('saltText');
const volumeText = document.getElementById('volumeInfoBox');
const volumeObj = document.getElementById('volumeObj');

const mInfo = document.getElementById('mInfo');
const vInfo = document.getElementById('vInfo');

//dropdown for material
const selectMat = document.getElementById("materialSelect");
const selectList = document.getElementById("selectList");
const fluidList = document.getElementById("fluidList");

//forcemeter change ui
const incForce = document.getElementById("incForce");
const decForce = document.getElementById("decForce");
const forcemeterLimit = document.getElementById("forcemeterLimit");

const record = document.getElementById("record");



let xyValues = [

  ];
  //console.log(xyValues[0]);
export { xyValues };



let object = {
    xPos:0.52,
    height:0.5,
    speed:0,
    gravity: -9.81,
    mass:massSlider.value/100,
    radius:changeRadius.value/10000,
    dragCoefficient:0,
    lengthSunk:0,
    ellipseFactor:0,
    c: heightSlider.value/10000,
    type: "sphere",  //possible sphere, cylinder, cube, cone
    mat: "coal",
    density: 1800,
    color: 0x32CD32
};
if (object.type == "cube"){
    object.radius *= 1.5;
}
object.dragCoefficient = 1/2*1.3*0.47*object.radius*object.radius*Math.PI*1;
object.ellipseFactor = object.radius/3;


let maxFall = 0.15;

//forcemeterLimit.textContent = "(" + 5 + " ± " + (5/100/5).toLocaleString() + ") N";
forcemeterLimit.textContent = "Μέγιστο: 5Ν";


//beaker characteristics
let beaker = {
    height:0.22,
    xPos:0,
    yPos:0.1,
    waterHeight:0.143,
    mixedHeight:0.143,
    radius:0.07,
    density: 997,
    ellipseFactor:0,
    saltContent : 0,
    accuracy : 1,
    startVolume : 2200
}
beaker.xPos = object.xPos-beaker.radius;
beaker.ellipseFactor = beaker.radius/3;

let fluid = {
    type: 'water',
    density: 997
}

// Physics variables
//let rope;

let ui = {
    upBtn:false,
    downBtn:false
}

let volumefluidStart = 2200;
let measurments = {
    volume : 1000, //in mL
    force : 5.1, //in N
    heightF : 0.5, // in m
    heightW : 0.5, // in m
    mass: 0.297, // in kg
    density : 1000, // in kg*m^3
    volumeObj : 100, // in mL
    densityFl : 997, // in kg*m^3
    gravity: 9.81
}
export { measurments };

let audio = false;
let audioMachine = new Audio('./sounds/sound1.mp3');
audioMachine.volume = 0;
audioMachine.loop=true;

let audioSplash = new Audio('./sounds/sound2.mp3');
audioSplash.volume = 0;

document.getElementById("volumeControl").addEventListener('click', function() {
    if (audio){
        audio = false;
        audioSplash.volume = 0;
        audioMachine.volume = 0;
    }
    else{
        audio = true;
        audioSplash.volume = 0.03;
        audioMachine.volume = 0.03;
    }
});

//events for when up Button is pressed
increaseHeight.addEventListener("mousedown", function(){
    ui.upBtn = true
    //increment();
})

increaseHeight.addEventListener("mouseup", function(){
    ui.upBtn = false
})

increaseHeight.addEventListener("mouseleave", function(){
    ui.upBtn = false
})

increaseHeight.addEventListener("touchstart", function(){
    ui.upBtn = true
    //increment();
})

increaseHeight.addEventListener("touchend", function(){
    ui.upBtn = false
})


//events for when down button is pressed
reduceHeight.addEventListener("mousedown", function(){
    ui.downBtn = true
    //decrement();
})

reduceHeight.addEventListener("mouseup", function(){
    ui.downBtn = false
})
reduceHeight.addEventListener("mouseleave", function(){
    ui.downBtn = false
})

reduceHeight.addEventListener("touchstart", function(){
    ui.downBtn = true
    //decrement();
})

reduceHeight.addEventListener("touchend", function(){
    ui.downBtn = false
})



//The parameter sliders
changeRadius.addEventListener("input", function(){
    object.radius = changeRadius.value/10000
    if (object.type == "sphere"){
        object.dragCoefficient = 1/2*1.3*0.47*object.radius*object.radius*Math.PI;
        object.ellipseFactor = object.radius/3;
        radiusText.textContent = "Ακτίνα: " + (object.radius*100).toFixed(1).toString().replace(".", ",") + " cm";
    }
    else if (object.type == "cylinder"){
        object.dragCoefficient = 1/2*1.3*0.8*object.radius*object.radius*Math.PI;
        radiusText.textContent = "Ακτίνα: " + (object.radius*100).toFixed(1).toString().replace(".", ",") + " cm";
    }
    else if (object.type == "cube"){
        object.dragCoefficient = 1/2*1.3*1*object.radius*object.radius*Math.PI;
        object.radius *= 1.5;
        radiusText.textContent = "Ακμή: " + (object.radius*100).toFixed(1).toString().replace(".", ",") + " cm";
    }
    else if (object.type == "cone"){
        object.dragCoefficient = 1/2*1.3*0.47*object.radius*object.radius*Math.PI;
        radiusText.textContent = "Ακτίνα: " + (object.radius*100).toFixed(1).toString().replace(".", ",") + " cm";
    }
    updateObjectMesh(object.type);

    let mode = document.querySelector('input[type=radio][name="tgmass"]:checked').value;
    if ( mode == "density"){
        calculateMass(object.density, object.type);
    }
    else{
        measurments.volumeObj = Math.round(getSubmergedVolume(object.type, 1)[0]*1000*1000);
        volumeObj.textContent = "V = " + measurments.volumeObj + "ml";
        vInfo.textContent = measurments.volumeObj + "ml";
        measurments.density = measurments.mass/measurments.volumeObj;
    }
})


massSlider.addEventListener("input", function(){
    object.mass = massSlider.value*10/1000;
    measurments.mass = object.mass;
    measurments.density = 1000*object.mass/measurments.volumeObj;
    massText.textContent = "Μάζα: " + object.mass.toFixed(3).replace(".", ",") + " kg";
    vInfo.textContent = measurments.volumeObj + "ml";
    mInfo.textContent = Math.round(measurments.mass*1000) + "gr";
    volumeObj.textContent = "V = " + measurments.volumeObj + "ml" +", m = " + measurments.mass.toFixed(3).replace(".", ",") + "kg";
})
saltSlider.addEventListener("input", function(){
    let density = 997 + 7.6*saltSlider.value;
    density = density > 1193 ? 1193 : density;
    density *= 1+((Math.random()-0.5))/50;
    beaker.saltContent = saltSlider.value;
    saltText.textContent = "NaCl: " + this.value + "% w/w";
    fluid.density = density;

})
heightSlider.addEventListener("input", function(){
    object.c = heightSlider.value/10000;
    updateObjectMesh(object.type);
    cText.textContent = "Ύψος: " + (object.c*100).toFixed(1).toString().replace(".", ",") + " cm";
    

    let mode = document.querySelector('input[type=radio][name="tgmass"]:checked').value;
    if ( mode == "density"){
        calculateMass(object.density, object.type);
    }
    else{
        measurments.volumeObj = Math.round(getSubmergedVolume(object.type, 1)[0]*1000*1000);
        volumeObj.textContent = "V = " + measurments.volumeObj + "ml";
        vInfo.textContent = measurments.volumeObj + "ml";
        measurments.density = measurments.mass/measurments.volumeObj;
    }
})


const gravitySlider = document.getElementById('gravitySlider');
const gravityText = document.getElementById('gravityText');
gravitySlider.addEventListener("input", function(){
    object.gravity = -this.value/100;
    measurments.gravity = this.value/100;
    gravityText.textContent = "g: " + (this.value/100).toFixed(2).toString().replace(".", ",") + " m/s²";
    //updateForcemeterRandom();
})


Array.prototype.forEach.call(radioShape, function(radio) {
    radio.addEventListener('change', changeHandler);
});
//heightSlider.style.display = 'none';
heightSlider.style.visibility = "hidden";
cText.style.visibility = "hidden";
//heightSlider.hidden = true;
//cText.hidden = true;
//cText.style.display = 'none';

function changeHandler(event) {
    FORCEM.changeVarHeight(0.8);
    object.height = 0.5;
    removeObject(object.type);
    object.type = this.value;
    changeRadius.dispatchEvent(new Event("input"));
    initialiseMeshObject(this.value);
    beaker.mixedHeight = beaker.waterHeight;

    if (this.value == 'sphere'){
        heightSlider.style.visibility = "hidden";
        cText.style.visibility = "hidden";
    }
    else {
        heightSlider.style.visibility = "visible";
        cText.style.visibility = "visible";
    }
}

Array.prototype.forEach.call(radioMass, function(radio) {
    radio.addEventListener('change', toggleMass);
});

massSlider.style.display = "none";
massText.style.display = "none";
massSlider.dispatchEvent(new Event("input"));

function toggleMass(event) {
    if (this.value == "density"){
        massSlider.style.display = "none";
        selectMat.style.display = "block";
        //selectMat.hidden = false;
        
        massText.style.display = "none";
        selectList.dispatchEvent(new Event("change"));
        if (object.mat == 'pine' || object.mat == 'walnut' || object.mat == 'coal'){
            updateMatt(false, object.mat);
        }
        else{
            updateMatt(true, object.color);
        }

    }
    else{
        massSlider.style.display = "block";
        selectMat.style.display = "none";
        massText.style.display = "block";
        massSlider.dispatchEvent(new Event("input"));
        updateMatt(true, 0xff0000);
    }
}

const showHeightLine = document.querySelector( '#showHeightLine' )
showHeightLine.addEventListener("change", function(){
    if (showHeightLine.checked){
        scene.add(lineHeight);
    }
    else{
        scene.remove(lineHeight);
    }
})

selectList.addEventListener('change', function() {
    object.mat = this.value;
    changeMaterial(this.value);
});

saltSlider.style.visibility = "hidden";
saltText.style.visibility = "hidden";
fluidList.addEventListener('change', function() {
    fluid.type = this.value;
    let colorIn, colorOut, opacity;
    saltSlider.style.visibility = "hidden";
    saltText.style.visibility = "hidden";
    switch (this.value){
        case 'water':
            fluid.density = 997;
            colorIn = 0x5555FF;
            colorOut = 0x7777FF;
            opacity = 0.45;
            saltSlider.style.visibility = "hidden";
            saltSlider.value = 0;
            saltText.style.visibility = "hidden";
            break;
        case 'oil':
            fluid.density = 920;
            colorIn = 0xb4a622;
            colorOut = 0xe4d96f;
            opacity = 0.6;
            break;
        case 'ethanol':
            fluid.density = 785;
            colorIn = 0xaaaaaa;
            colorOut = 0xcccccc;
            opacity = 0.3;
            break;
        case 'glycerine':
            fluid.density = 1260;
            colorIn = 0xaaaaaa;
            colorOut = 0xcccccc;
            opacity = 0.3;
            break;
        case 'glucose':
            fluid.density = 1560;
            colorIn = 0xaaaaaa;
            colorOut = 0xcccccc;
            opacity = 0.2;
            break;
        case 'gasoline':
            fluid.density = 730;
            colorIn = 0xb4a622;
            colorOut = 0xe4d96f;
            opacity = 0.3;
            break;
    }

    const cylinderMats = [
        new THREE.MeshBasicMaterial( {color: colorIn, transparent: true} ),
        new THREE.MeshBasicMaterial( {color: colorOut, transparent: true, side: THREE.DoubleSide} ),
        new THREE.MeshBasicMaterial( {color: colorIn, transparent: true, side: THREE.DoubleSide} )
    ];

    cylinder.material[0].dispose();
    cylinder.material[1].dispose();
    cylinder.material[2].dispose();
    cylinder.material = cylinderMats;
    cylinder.material[0].opacity = opacity;
    cylinder.material[1].opacity = opacity;
    cylinder.material[2].opacity = opacity;

    measurments.densityFl = fluid.density;

});

incBeakerHeightBtn.addEventListener('click', function() {

    beaker.height += 0.01;

    disableBtn(decBeakerHeightBtn, "enable");
    if (beaker.height >= 0.299){
        disableBtn(incBeakerHeightBtn, "disable");
    }
    beakerHeightValue.textContent = (beaker.height*100).toPrecision(2) + "cm";
    redrawBeaker(beaker.radius, beaker.height);
    resizeCanvas();
});

decBeakerHeightBtn.addEventListener('click', function() {
    beaker.height -= 0.01;

    disableBtn(incBeakerHeightBtn, "enable");
    if (beaker.height < 0.101){
        disableBtn(decBeakerHeightBtn, "disable");
    }
    beakerHeightValue.textContent = (beaker.height*100).toPrecision(2) + "cm";
    redrawBeaker(beaker.radius, beaker.height);
    resizeCanvas();
});

incBeakerRadiusBtn.addEventListener('click', function() {
    beaker.radius += 0.005;
    resizeCanvas();
    disableBtn(decBeakerRadiusBtn, "enable");
    if (beaker.radius > 0.099){
        disableBtn(incBeakerRadiusBtn, "disable");
    }
    beakerRadiusValue.textContent = Number((beaker.radius*100).toPrecision(2)).toLocaleString() + "cm";
    redrawBeaker(beaker.radius, beaker.height);
});

decBeakerRadiusBtn.addEventListener('click', function() {
    beaker.radius -= 0.005;
    resizeCanvas();
    disableBtn(incBeakerRadiusBtn, "enable");
    if (beaker.radius < 0.026){
        disableBtn(decBeakerRadiusBtn, "disable");
    }
    beakerRadiusValue.textContent = Number((beaker.radius*100).toPrecision(2)).toLocaleString() + "cm";
    redrawBeaker(beaker.radius, beaker.height);
});

incForce.addEventListener('click', function() {
    let force = FORCEM.maxForce;
    let ratio = 5;
    disableBtn(decForce, "enable");
    switch (force){
        case 1 :
            force = 5;
            break
        case 5 :
            force = 10;
            // ratio = 10;
            break
        case 10 :
            force = 50;
            break
        case 50 :
            force = 100;
            // ratio = 10;
            disableBtn(incForce, "disable");
            break
    }
    FORCEM.changeMaxForce(force);
    if (isError){
        forcemeterLimit.textContent = "(" + force + " ± " + (force/100).toLocaleString() + ") N";
    }
    else{
        forcemeterLimit.textContent = "Μέγιστο: " + force + "N";
        document.getElementById("forcemeterLimitSec").textContent = "Ακρίβεια: " + (force/100/ratio).toLocaleString() + "N";
    }
    
});

export function resetForceLimit(){
    if (FORCEM.maxForce == 1){
        incForce.click();
        decForce.click();
    }
    else{
        decForce.click();
        incForce.click();  
    }

}

decForce.addEventListener('click', function() {
    let force = FORCEM.maxForce;
    let ratio = 5;
    disableBtn(incForce, "enable");
    switch (force){
        case 100 :
            force = 50;
            break
        case 50 :
            force = 10;
            // ratio = 10;
            break
        case 10 :
            force = 5;
            break
        case 5 :
            force = 1;
            // ratio = 10;
            disableBtn(decForce, "disable");
            break
    }
    FORCEM.changeMaxForce(force);
    if (isError){
        forcemeterLimit.textContent = "(" + force + " ± " + (force/100).toLocaleString() + ") N";
    }
    else{
        forcemeterLimit.textContent = "Μέγιστο: " + force + "N";
        document.getElementById("forcemeterLimitSec").textContent = "Ακρίβεια: " + (force/100/ratio).toLocaleString() + "N";
    }
});

function disableBtn(btn, toDo){
    if (toDo == "disable"){
        btn.disabled = true;
        btn.style.opacity =  0.6;
        btn.style.cursor =  "not-allowed";
    }
    else {
        btn.disabled = false;
        btn.style.opacity =  1;
        btn.style.cursor =  "";
    }

}


let cameraDimention = '2D';

//the button that changes between 2D and 3D
const buttonDimention = document.querySelector( '#buttonDimention' )
buttonDimention.addEventListener("click", function(){
    if (buttonDimention.classList.contains("active")){
        cameraDimention = '3D';
    }
    else {
        cameraDimention = '2D';
        //beakerMesh.out.rotation.y = 0;
    }
})






window.addEventListener('resize', function(){
    resizeCanvas();
});

if(window.innerWidth / window.innerHeight > 1){
    document.getElementById("showParameters").checked = true;
}
if(window.innerWidth / window.innerHeight > 1.5){
    document.getElementById("showData").checked = true;
}

let offsetX = 0;
function resizeCanvas(){
    //First resize the canvas element
    canvas.height = window.innerHeight*1;
    canvas.width = window.innerWidth;

    let aspect = canvas.width / canvas.height;
    if (aspect < 0.7){
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth/0.7;
        offsetX = 0;
    }
    else if (aspect < 1.6){
        offsetX = (aspect - 0.7)*0.2;
    }
    else{
        offsetX = 0.2;
    }

    // if(aspect < 1){
    //     document.getElementById("showParameters").checked = false;
    //     //document.getElementById("closeParameters").style.visibility = "hidden";
    // }

    // else{
    //     //document.getElementById("closeParameters").style.visibility = "visible";
    // }
    // if (canvas.width < 1000 || canvas.height < 700){
    //     canvas.width = 1000;
    //     canvas.height = 700;
    // }

    // if (window.innerHeight*4/3 < window.innerWidth){
    //     canvas.height = window.innerHeight;
    //     canvas.width = window.innerHeight*4/3;
    // }
    // else{
    //     canvas.width = window.innerWidth;
    //     canvas.height = window.innerWidth*3/4;
    // }
    // if (canvas.width < 800 || canvas.height < 600){
    //     canvas.width = 800;
    //     canvas.height = 600;
    // }
    //depending on the canvas element resize the div container
    container.style.height = canvas.height+'px';
    container.style.width = canvas.width+'px' ;
    //resize the camera

    camera.right = canvas.width / canvas.height /2 + object.xPos + offsetX;
    camera.left = -canvas.width / canvas.height /2 + object.xPos + offsetX;
    //const camera = new THREE.OrthographicCamera( left,right,top,bottom, near, far );
    camera.updateProjectionMatrix();

    renderer.setSize( canvas.width, canvas.height );
    renderer.setPixelRatio( window.devicePixelRatio );

        //resize the buttons
        const unit = canvas.height;
        const unitW = canvas.width;
        let a = unitW/(canvas.width / canvas.height) //pixel/m
        document.getElementById("incDecHeight").style.left = (unitW/2+a*(-offsetX+beaker.radius*1.2))/window.devicePixelRatio + "px";
        document.getElementById("forceDiv").style.left = (unitW/2+a*(-offsetX+beaker.radius*1.2))/window.devicePixelRatio + "px";
        // increaseHeight.style.height = unit/20 + 'px';
        // increaseHeight.style.width = unit/20 + 'px';
        // increaseHeight.style.borderRadius = unit/60 + 'px';
        // increaseHeight.style.fontSize = unit/30 + 'px';
        // reduceHeight.style.height = unit/20 + 'px';
        // reduceHeight.style.width = unit/20 + 'px';
        // reduceHeight.style.borderRadius = unit/60 + 'px';
        // reduceHeight.style.fontSize = unit/30 + 'px';
        // //Place the buttons
        // increaseHeight.style.left = canvas.width*(object.xPos + beaker.radius + 0.03)*3/4  + 'px';
        // reduceHeight.style.left = canvas.width*(object.xPos + beaker.radius + 0.03)*3/4   + 'px';
        // increaseHeight.style.bottom = canvas.height*(beaker.mixedHeight + beaker.yPos ) + 1.6* unit/10 + 'px';
        // reduceHeight.style.bottom = canvas.height*(beaker.mixedHeight + beaker.yPos ) + unit/10 + 'px';
        //the text for the height
        // heightText.style.left = canvas.width*(object.xPos + beaker.radius + 0.03)*3/4  + 'px';
        // heightText.style.bottom = canvas.height*(beaker.mixedHeight + beaker.yPos ) + 2.2*unit/10 + 'px';
        // //the checkbox for the height arrow
        // showHeightLine.style.left = canvas.width*(object.xPos + beaker.radius + 0.005)*3/4  + 'px';
        // showHeightLine.style.bottom = canvas.height*(beaker.mixedHeight + beaker.yPos ) + 2.25*unit/10 + 'px';
        //resise indicator for volume
        // volumeText.style.fontSize = unit/40 + 'px';

        //the record Button
        // record.style.left = canvas.width*(object.xPos)*3/4 - 68.5  + 'px';
        if (canvas.height < 800){
            // record.style.fontSize = (160 - 120*(800- canvas.height)/525).toString() + "%"
            // record.style.left = canvas.width*(object.xPos)*3/4 - 68.5 + 45*(800- canvas.height)/525 + 'px';
            volumeObj.style.fontSize = (100 - 40*(800- canvas.height)/525).toString() + "%"
        }
        else{
            // record.style.fontSize = "160%";
            volumeObj.style.fontSize = "100%";
        }


        //forcemetertext
        //forceText.style.left = canvas.width*(object.xPos)*3/4 - 90  + 'px';
}



	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

    renderer.shadowMap.enabled = true;


	const fov = 18;
	const aspect = 4/3; // 4:3 aspect ratio
	const near = 0.1;
	const far = 10;
	//const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    //const camera = new THREE.OrthographicCamera( left,right,top,bottom, near, far );
    const camera = new THREE.OrthographicCamera( 0,4/3,1,0, near, far );
	camera2D(camera);

function camera3D(camera){
    camera.position.z = 9;
    camera.position.y = 3;
    camera.lookAt( 0,0,0 );
}

function camera2D(camera){
    camera.position.z = 9;
    camera.position.y = 0;
    camera.lookAt( 0,0,0 );
}

function moveCameraStep(camera, dimention, step){
    if (dimention === '2D'){
        if (camera.position.y > 0 || cube.rotation.y > 0){
            camera.position.y -= step;
            camera.position.y = camera.position.y < 0 ? 0 : camera.position.y;
            cube.rotation.y -= step/3;
            cube.rotation.y = cube.rotation.y < 0 ? 0 : cube.rotation.y;
            camera.lookAt( 0, 0, 0 );
        }
    }
    else if (dimention === '3D'){
        if (camera.position.y < 3 || cube.rotation.y < Math.PI/4){
            camera.position.y += step;
            camera.position.y = camera.position.y > 3 ? 3 : camera.position.y;
            cube.rotation.y += step/3;
            cube.rotation.y = cube.rotation.y > Math.PI/4 ? Math.PI/4 : cube.rotation.y;
            camera.lookAt( 0,0,0 );
        }
    }
}

const scene = new THREE.Scene();

drawBackground(scene, beaker.yPos);

	{

		const color = 0xFFFFFF;
		const intensity = 2;
		const light = new THREE.DirectionalLight( color, intensity );
		//light.position.set( - 1, 2, 4 );
        light.position.set( 0, 2, 2 );
        light.lookAt(-1,0,0);

        const lightAmbient = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
        scene.add(lightAmbient);

        const lightSimple = new THREE.PointLight( 0xff0000, 1, 100 );
        lightSimple.position.set( 0, 2, -1 );
        //scene.add( light );
        light.lookAt(-1,0,0);
        
        const light2 = new THREE.DirectionalLight(0xFFFFFF, intensity);
        light2.position.set(-1, 1, 2);
        light2.lookAt(0,0,0);
        scene.add(light2);

        const light3 = new THREE.DirectionalLight(0x404040, 10*intensity);
        light3.position.set(0, 0, 2);
        light3.lookAt(0,0,0);
        //scene.add(light3);

	}

    
    function calculateNewPosition(dt, type){
        let isInWaterBefore = isInWater;
        dt = (dt>50) ? 50 : dt;
        dt /= 1000;
        //Calculate the movement
        let steps = 100;
        let ddt = dt/steps;
        for(let i = 0; i < steps; i++){
            let acceleration = calculateForce()/object.mass;
            object.speed += acceleration*ddt;
            object.height += object.speed*ddt;
        }

        //calculate if there will be displacement of the force Meter
        let displacement;
        let ropeHeight = object.height;
        if (FORCEM.height - ropeHeight > 0.3 ){
            displacement = FORCEM.height - ropeHeight - 0.3;
        }
        else{
            displacement = 0;
        }

        //If the next height is lower than the maxFall or the bottom then it cannot fall
        if (type == "sphere"){
            if (object.height <= (2*object.radius + beaker.yPos)){
                object.height = 2*object.radius + beaker.yPos;
                object.speed = 0;
            }
        }
        else if (type == "cylinder"){
            if (object.height <= (object.c + beaker.yPos)){
                object.height = object.c + beaker.yPos;
                object.speed = 0;
            }
        }
        else if (type == "cube"){
            if (object.height <= (object.c + beaker.yPos)){
                object.height = object.c + beaker.yPos;
                object.speed = 0;
            }
        }
        else if (type == "cone"){
            if (object.height <= (object.c + beaker.yPos)){
                object.height = object.c + beaker.yPos;
                object.speed = 0;
            }
        }

        if (displacement > 0.05 ) {
            ropeHeight = FORCEM.height - 0.3 - 0.05;
            object.height = ropeHeight;
            object.speed = 0;
        }


        measurments.force = FORCEM.placeForceMeter(displacement, holder);
        placeRope(ropeHeight, FORCEM.height - displacement, type);

        if (isInWater != isInWaterBefore && Math.abs(object.speed) > 0.1){
            audioSplash.play();
        }
        
    }

let isInWater = false;

//This function calculates the force not depending on vertical position
function calculateForce(){
    let type = object.type;
    let force;

    //add gravity according to objects mass
    force = object.mass*object.gravity;

    //First calculate if there is intersection between the object and the fluid
    let [dVolume, circumference] = getSubmergedVolume(type, beaker.yPos + beaker.mixedHeight);

    if (dVolume == 0){
        //add the draf Force
        force += object.dragCoefficient*(-1)*object.speed*Math.abs(object.speed);
        isInWater = false;
        beaker.mixedHeight = beaker.waterHeight + dVolume/(Math.PI*beaker.radius*beaker.radius);
    }
    else {
        //change the container water Height according to volume
        beaker.mixedHeight = beaker.waterHeight + dVolume/(Math.PI*beaker.radius*beaker.radius);

        //Calculate The Boyancy from submerged Volume
        force += fluid.density * dVolume * Math.abs(object.gravity);
        //Add the resistance from water
        force += object.dragCoefficient*(-1)*object.speed*Math.abs(object.speed)*(fluid.density/1.3);
        //if on surface add extra resistance from surface tension
        force += (-1)*object.speed*circumference*1;
        isInWater = true;
    }
    //add the force of the displaced force meter. For now up to 5 N;
    if (FORCEM.displacement < 0){
        force += -FORCEM.maxForce/0.05*FORCEM.displacement;
        //add resistance to spring movement in order not to bounce
        force += -FORCEM.maxForce*object.speed;
    }
    
    return force;
}
    

    let ruler;
    let holder;
    let canvasRuler = document.createElement('canvas');
    let ctxRuler = canvasRuler.getContext('2d');
    function initialiseScene(){
        const rulerHeight = 0.85;
        //add the ruler markings every 1cm
        canvasRuler.width = 5000*0.05; //in mm
        canvasRuler.height = rulerHeight*5000;
        ctxRuler.fillStyle = "grey";

        ctxRuler.font = "80px Arial";
        ctxRuler.lineWidth = 10;



        ctxRuler.fillRect(0, 0, canvasRuler.width, canvasRuler.height);
        for (let i = 0; i < canvasRuler.height; i+=50){
            ctxRuler.beginPath();
            ctxRuler.moveTo(200, i);
            ctxRuler.lineTo(250, i);
            ctxRuler.stroke();
        }
        //every 0.5cm
        for (let i = 25; i < canvasRuler.height; i+=25){
            ctxRuler.beginPath();
            ctxRuler.moveTo(230, i);
            ctxRuler.lineTo(250, i);
            ctxRuler.stroke();
        }
        //text evert 5cm
        for (let i = 50; i <= canvasRuler.height; i+=250){
            ctxRuler.fillStyle = "black";
            ctxRuler.fillText((86-i/50).toString(), 50, i-30);
        }
        //every 5cm
        for (let i = canvasRuler.height; i > 0; i-=250){
            ctxRuler.beginPath();
            ctxRuler.moveTo(180, i);
            ctxRuler.lineTo(250, i);
            ctxRuler.stroke();
        }
        

        ctxRuler.beginPath();
        ctxRuler.moveTo(0, 0);
        ctxRuler.lineTo(0, canvasRuler.height);
        ctxRuler.lineTo(canvasRuler.width, canvasRuler.height);
        ctxRuler.lineTo(canvasRuler.width, 0);
        ctxRuler.lineTo(0, 0);
        ctxRuler.stroke();




                
        //first add the ruler
        const textureRuler = new THREE.CanvasTexture(canvasRuler);
        const geomRuler = new THREE.BoxGeometry( 0.05, rulerHeight, 0.02 );
        const matRuler = new THREE.MeshBasicMaterial( { map: textureRuler } );
        ruler = new THREE.Mesh( geomRuler, matRuler );
        scene.add(ruler);
        ruler.position.x = object.xPos - 0.15;
        ruler.position.y = beaker.yPos + rulerHeight/2;



        const geomHolder = new THREE.BoxGeometry( object.xPos - ruler.position.x + 0.02, 0.01, 0.015 );
        const matHolder = new THREE.MeshPhongMaterial( { color: 0x9e6c1b } );
        holder = new THREE.Mesh( geomHolder, matHolder );
        scene.add(holder);
        holder.position.x = ruler.position.x + (object.xPos - ruler.position.x)/2
        holder.position.y = FORCEM.height + 0.1;

        let mode = document.querySelector('input[type=radio][name="tgmass"]:checked').value;
        if ( mode == "density"){
            calculateMass(object.density, object.type);
        }
    }
    initialiseScene();

    function changeMaterial(mat){
        let density = 100;
        switch(mat){
            case 'coal':
                density = 1800;
                updateMatt(false, 'coal', object.type);
            break;
            case 'pine':
                density = 500;
                updateMatt(false, 'pine', object.type);
            break;
            case 'walnut':
                density = 670;
                updateMatt(false, 'walnut', object.type);
            break;
            case 'steel':
                density = 8000;
                updateMatt(true, 0xb0b3b7, object.type);
                object.color = 0xb0b3b7;
            break;
            case 'aluminum':
                density = 2700;
                updateMatt(true, 0xd0d5d7, object.type);
                object.color = 0xd0d5d7;
            break;
            case 'iron':
                density = 7860;
                updateMatt(true, 0xD4D7D9, object.type);
                object.color = 0xD4D7D9;
            break;
            case 'PE':
                density = 950;
                updateMatt(true, 0xeeeeee, object.type);
                object.color = 0xeeeeee;
            break;
            case 'ABS':
                density = 1100;
                updateMatt(true, 0x32CD32, object.type);
                object.color = 0x32CD32;
            break;
        }
        
        object.density = density;
        calculateMass(density, object.type);
    }

    function calculateMass(density, type){
        let volume = getSubmergedVolume(type, 1)[0];
        measurments.volumeObj = Math.round(volume*1000*1000);

        let mass = volume*density
        object.mass = mass;
        measurments.mass = mass;
        measurments.density = density;

        volumeObj.textContent = "V = " + measurments.volumeObj + "ml" +", m = " + measurments.mass.toFixed(3).replace(".", ",") + "kg";
        vInfo.textContent = measurments.volumeObj + "ml";
        mInfo.textContent = Math.round(measurments.mass*1000) + "gr";
        document.getElementById("volumeTextP").textContent = "V = " + measurments.volumeObj + "ml";
        document.getElementById("massTextP").textContent = "m = " + Math.round(measurments.mass*1000) + "gr";
    }

    function updateMatt(color, text, type){
        let mat;
        if (color == false){
            let texture = new THREE.TextureLoader().load('textures/' + text + '.jpg' ); 
            mat = new THREE.MeshPhongMaterial( { map :  texture} );
        }
        else{
            mat = new THREE.MeshPhongMaterial( { color: text} );
        }





        sphere.material.dispose();
        sphere.material = mat;

        cube.material.dispose();
        cube.material = mat;

        cyl.material.dispose();
        cyl.material = mat;

        cone.material.dispose();
        cone.material = mat;
    }

	const geometry = new THREE.BoxGeometry( object.radius, object.c, object.radius );

	const material = new THREE.MeshPhongMaterial( { color: 0xFF0000 } ); // greenish blue

	const cube = new THREE.Mesh( geometry, material );


    const geometry2 = new THREE.SphereGeometry( object.radius, 32, 16 ); 
    const material2 = new THREE.MeshPhongMaterial( { color: 0xFF0000 } ); 
    const sphere = new THREE.Mesh( geometry2, material2 ); 

    const geometryCyl = new THREE.CylinderGeometry( object.radius, object.radius, object.c, 32, 1 );
    const materialCyl = new THREE.MeshPhongMaterial( { color: 0xFF0000 } ); 
    const cyl = new THREE.Mesh( geometryCyl, materialCyl ); 

    const geometryCone = new THREE.ConeGeometry( object.radius, object.c, 32 ); 
	const materialCone = new THREE.MeshPhongMaterial( { color: 0xFF0000 } ); // greenish blue
	const cone = new THREE.Mesh( geometryCone, materialCone );

    //const geometryCylinder = new THREE.CylinderGeometry( beaker.radius, beaker.radius, beaker.mixedHeight, 32, 1 ); 
    const geometryCylinder = new THREE.CylinderGeometry( beaker.radius, beaker.radius, beaker.mixedHeight, 32, 1 );
    //const materialCylinder = new THREE.MeshBasicMaterial( {color: 0x5555FF, transparent: true} ); 
    //const materialCylinder = new THREE.MeshBasicMaterial( {color: 0x5555FF, transparent: true, side: THREE.DoubleSide} ); 
    //const cylinder = new THREE.Mesh( geometryCylinder, materialCylinder ); 
    const cylinderMats = [
        new THREE.MeshBasicMaterial( {color: 0x5555FF, transparent: true} ),
        new THREE.MeshBasicMaterial( {color: 0x7777FF, transparent: true, side: THREE.DoubleSide} ),
        new THREE.MeshBasicMaterial( {color: 0x5555FF, transparent: true, side: THREE.DoubleSide} )
    ];

    const cylinder = new THREE.Mesh( geometryCylinder, cylinderMats); 

    scene.add( cylinder );


    cyl.position.x = object.xPos;
    cyl.position.y = object.height;

    cube.position.x = object.xPos;
    cube.position.y = object.height;
    cube.rotation.y = (Math.PI/4);

    cone.position.x = object.xPos;
    cone.position.y = object.height;

    cylinder.position.y = beaker.yPos+beaker.mixedHeight/2;
    sphere.position.y = 0.6;

    cylinder.position.x = object.xPos;
    sphere.position.x = object.xPos;

    //cylinder.material.opacity = 0.4;
    cylinder.material[0].opacity = 0.45;
    cylinder.material[1].opacity = 0.45;
    cylinder.material[2].opacity = 0.45;


    const geometryCircle = new THREE.CircleGeometry( beaker.radius, 32 ); 
    const materialCircle = new THREE.MeshBasicMaterial( { color: 0x7777FF, transparent: true} ); 
    const circle = new THREE.Mesh( geometryCircle, materialCircle );
    
    //scene.add( circle );
    circle.position.x = object.xPos;
    circle.position.y = beaker.yPos+beaker.mixedHeight;
    //circle.rotation.x = 0.92;
    circle.rotation.x = 4.72;
    //circle.position.z = +0.1;
    circle.material.opacity = 0.5;



    let curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3( 0, 0.3, 0 ),
        new THREE.Vector3( 0, 0.1, 0 ),
        new THREE.Vector3( 0, 0, 0 )
    );

    const points = curve.getPoints( 50 );
    const geometryRope = new THREE.BufferGeometry().setFromPoints( points );
    const materialRope = new THREE.LineBasicMaterial( { color: 0x000000, linewidth:1 } );

    const rope = new THREE.Line( geometryRope, materialRope );
    rope.position.x = object.xPos;


    //scene.add(rope);
    //let [rope, ropeData] = createRope(0.3, 100);
    
    scene.add(rope);
    rope.rotation.y = -2.2; //-2.2
    //rope.geometry.attributes.instanceStart.data.needsUpdate = true;
    
    //rope.geometry.attributes.instanceEnd.setXYZ( index - 1, 0, 0.1, 0 );
    //rope.geometry.attributes.position.setXYZ( index, 0.2, 0.1, 0 );
    //rope.geometry.attributes.position.set( index-1, 0.2, 0.09, 0 );

    function updateRope(low, high, data){
        let segments = 100;
        let segmentLength = 0.3/segments;
        //console.log(segmentLength);

        
        let gravity = -0.1;
        let drag = -0.2;
        //first and last points
        data[0].lx = data[0].x;
        data[0].x = object.xPos;
        data[0].ly = data[0].y;
        data[0].y = high;
        data[0].lz = data[0].z;
        data[0].z = 0;
        rope.geometry.attributes.position.setXYZ(0,  object.xPos, high, 0 );

        data[segments].lx = data[segments].x;
        data[segments].x = object.xPos;
        data[segments].ly = data[segments].y;
        data[segments].y = low;
        data[segments].lz = data[segments].z;
        data[segments].z = 0;
        rope.geometry.attributes.position.setXYZ(segments,  object.xPos, low, 0 );

        
        for (let i = 1; i < segments; i++){
            //Verlet integration
            let x = data[i].x + (data[i].x - data[i].lx)*(1 + drag);
            let y = data[i].y + (data[i].y - data[i].ly)*(1 + drag) + gravity;
            let z = data[i].z + (data[i].z - data[i].lz)*(1 + drag);




            //the distance Betewen two concequetive points has to be equal to segment Length
            let distance = distanceBetweenPoints(x , y, z, data[i-1].x, data[i-1].y, data[i-1].z);

            let fraction = ((segmentLength - distance) / distance) / (2);
            //console.log(fraction);
            x += (x - data[i-1].x)*fraction*2;
            y += (y - data[i-1].y)*fraction*2;
            z += (z - data[i-1].z)*fraction*2;

            rope.geometry.attributes.position.setXYZ( i, x, y, z );

            //distance = distanceBetweenPoints(x , y, z, data[i-1].x, data[i-1].y, data[i-1].z);
            //console.log(distance - segmentLength);


            //Check if the point is inside the object
            //The Sphere
            let inside = distanceBetweenPoints(x, y, z, object.xPos, object.height, 0);
            if (inside < object.radius){
                let distance = object.radius - inside;
                let fraction = distance*1.05/inside;
                //console.log(inside*inside);
                x += Math.sqrt(object.radius*object.radius - inside*inside);
                //y += (y - object.height)*fraction;
                //z += (z - 0)*fraction + (y - object.height)*fraction;
                //console.log(distanceBetweenPoints(x, y, z, object.xPos, object.height, 0));
            }





            //pass new variables to array
            data[i].lx = data[i].x;
            data[i].x = x;
            data[i].ly = data[i].y;
            data[i].y = y;
            data[i].lz = data[i].z;
            data[i].z = z;
            

            
        }
        //do the thing for the last section
        //let distance = distanceBetweenPoints(data[segments].x , data[segments].y, data[segments].z, data[segments-1].x, data[segments-1].y, data[segments-1].z);
        //let fraction = ((segmentLength - distance) / distance) / 2;
        //data[segments].x += (data[segments].x - data[segments-1].x)*fraction*2;
        //data[segments].y += (data[segments].y - data[segments-1].y)*fraction*2;
        //data[segments].z += (data[segments].z - data[segments-1].z)*fraction*2;

        rope.geometry.attributes.position.needsUpdate = true;
        //rope.rotation.y += 0.01;

    }

    function distanceBetweenPoints(x1, y1, z1, x2, y2, z2){
        return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) + (z1-z2)*(z1-z2));
    }

    


    function createRope(length, segments ){
        const points = [];
        let ropeData = new Array();

        let segmentLength = length/segments;

        for (let i = 0; i <= segments; i++){
            let vertex = {   
                x : object.xPos+0.2, // current position
                y : i*segmentLength,
                z : 0,
                lx : object.xPos+0.2,  // last position This point is not moving hence the last pos 
                ly : i*segmentLength,  // is the same as the current
                lz : 0
            }
            points.push( new THREE.Vector3( vertex.x, vertex.y, 0 ) );
            ropeData.push(vertex);
        }
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial({
            color: 0x000000
        });
        const line = new THREE.Line( geometry, material );
        return [line, ropeData];

    }



let canvasBeaker = document.createElement('canvas');
let ctx = canvasBeaker.getContext('2d');
let textureBeaker;
drawBeakerLines();

function drawBeakerLines(){
    //ctx.imageSmoothingEnabled= false;
    canvasBeaker.style = "font-smooth: never; -webkit-font-smoothing : none;"
    canvasBeaker.width = 1000*2*Math.PI*beaker.radius;
    canvasBeaker.height = 1000*beaker.height;   //in mm
    //ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvasBeaker.width, canvasBeaker.height);
    ctx.fillStyle = 'rgba(224, 242, 241, 0.2)';

    ctx.fillRect(0, 0, canvasBeaker.width, canvasBeaker.height);
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.font = "10px Arial";

    //ctx.strokeRect(0, 0, canvasBeaker.width, canvasBeaker.height);
    //console.log(beaker.height*beaker.radius*beaker.radius*Math.PI*1000*1000 );

    //first calculate the total volume in ml
    let totalBeakerVolume = beaker.height*beaker.radius*beaker.radius*Math.PI*1000*1000;
    //calculate total line that can be drawn
    let totalLinesToDraw = canvasBeaker.height / 3; //73
    //calculate the step in ml with each line
    let stepPerLine = totalBeakerVolume/totalLinesToDraw;
    //round ster per line to nearest 1,2,5,10,20,50,100
    if (stepPerLine < 1.5){
        stepPerLine = 1;
    }
    else if (stepPerLine < 3.5 ){
        stepPerLine = 2;
    }
    else if (stepPerLine < 8 ){
        stepPerLine = 5;
    }
    else if (stepPerLine < 15 ){
        stepPerLine = 10;
    }
    else if (stepPerLine < 35 ){
        stepPerLine = 20;
    }
    else if (stepPerLine < 80 ){
        stepPerLine = 50;
    }
    else {
        stepPerLine = 100;
    }
    beaker.accuracy = stepPerLine/2;

    let startLine = 5*stepPerLine; //in ml
    let stopLine = Math.floor(totalBeakerVolume/stepPerLine)*stepPerLine-5*stepPerLine; //in ml
    

    //place all the single lines        
    for (let i = startLine; i <= stopLine; i+= stepPerLine){
        strokeLines(ml2Px(i), 5);
    }
    //place the big lines
    for (let i = startLine; i <= stopLine; i+= 5*stepPerLine){
        strokeLines(ml2Px(i), 10);
    }
    //place the text
    startLine = 10*stepPerLine; //in ml
    for (let i = startLine; i <= stopLine; i+= 10*stepPerLine){
        ctx.fillText(i.toString(), 10, ml2Px(i)+3);
    }


    //ctx.fillText("100", 10, 73);

    //strokeLines(70, 10);

    function strokeLines(height, length){
        // Start a new Path
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(length, height);

        // Draw the Path
        ctx.stroke();
    }

    function ml2Px (ml) {
        return canvasBeaker.height-(ml/(Math.PI*beaker.radius*beaker.radius*1000));
    }

}


    //draw the force meter
    FORCEM.drawForceMeter(scene, object.xPos, object.height);

let beakerMesh = {
    bot:0,
    top:0,
    in:0,
    out:0
}
function drawBeaker(){
    const geometryBtm = new THREE.CylinderGeometry( beaker.radius+0.005, beaker.radius+0.005, 0.005, 32, 1 ); 
    const materialBeaker = new THREE.MeshBasicMaterial( {color: 0xE0F2F1, transparent: true} ); 
    beakerMesh.bot = new THREE.Mesh( geometryBtm, materialBeaker ); 

    beakerMesh.bot.position.x = object.xPos;
    beakerMesh.bot.position.y = beaker.yPos;
    beakerMesh.bot.material.opacity = 0.2;

    textureBeaker = new THREE.CanvasTexture(canvasBeaker);

    const geometryWalls = new THREE.CylinderGeometry( beaker.radius+0.005, beaker.radius+0.005, beaker.height, 32, 1, true); 
    const materialOutBeaker = new THREE.MeshBasicMaterial( { map: textureBeaker, transparent: true } );
    beakerMesh.out = new THREE.Mesh( geometryWalls, materialOutBeaker ); 
    
    beakerMesh.out.position.x = object.xPos;
    beakerMesh.out.position.y = beaker.yPos+beaker.height/2;
    beakerMesh.out.rotation.y = 0.2;
    beakerMesh.out.renderOrder = 2;
    beakerMesh.out.material.side = THREE.DoubleSide;


    const geometryInWalls = new THREE.CylinderGeometry( beaker.radius+0.001, beaker.radius+0.001, beaker.height, 32, 1, true); 
    beakerMesh.in = new THREE.Mesh( geometryInWalls, materialBeaker ); 

    beakerMesh.in.position.x = object.xPos;
    beakerMesh.in.position.y = beaker.yPos+beaker.height/2;
    beakerMesh.in.material.opacity = 0.2;
    beakerMesh.in.renderOrder = 2;

    const geometryRing = new THREE.RingGeometry( beaker.radius+0.001, beaker.radius+0.005, 32 );
    beakerMesh.top = new THREE.Mesh( geometryRing, materialBeaker );
    beakerMesh.top.position.x = object.xPos;
    beakerMesh.top.position.y = beaker.yPos+beaker.height;
    beakerMesh.top.rotation.x = 4.72;


    

    scene.add(beakerMesh.bot);
    scene.add(beakerMesh.out);
    scene.add(beakerMesh.in);
    scene.add(beakerMesh.top);
}
drawBeaker();
redrawBeaker(beaker.radius, beaker.height);
function redrawBeaker(radius, height){
    beakerMesh.bot.geometry.dispose();
    beakerMesh.bot.geometry = new THREE.CylinderGeometry( radius+0.005, radius+0.005, 0.005, 32, 1 );

    beakerMesh.out.geometry.dispose();
    beakerMesh.out.geometry = new THREE.CylinderGeometry( radius+0.005, radius+0.005, height, 32, 1, true);
    beakerMesh.out.position.y = beaker.yPos+height/2;

    beakerMesh.in.geometry.dispose();
    beakerMesh.in.geometry = new THREE.CylinderGeometry( radius+0.001, radius+0.001, height, 32, 1, true);
    beakerMesh.in.position.y = beaker.yPos+height/2;

    beakerMesh.top.geometry.dispose();
    beakerMesh.top.geometry = new THREE.RingGeometry( radius+0.001, radius+0.005, 32 );
    beakerMesh.top.position.y = beaker.yPos+beaker.height;

    drawBeakerLines();
    //let texture = new THREE.CanvasTexture(canvasBeaker);
    //beakerMesh.out.material.dispose();
    //beakerMesh.out.material = new THREE.MeshBasicMaterial( { map: textureBeaker, transparent: true } );

    textureBeaker.dispose();
    textureBeaker = new THREE.CanvasTexture(canvasBeaker);
    beakerMesh.out.material.map = textureBeaker;

    //change xPos
    if(radius > 0.069){
        object.xPos = 0.52 + radius - 0.07;
        beaker.xPos = object.xPos;
        cylinder.position.x = beaker.xPos;
        beakerMesh.bot.position.x = beaker.xPos;
        beakerMesh.out.position.x = beaker.xPos;
        beakerMesh.in.position.x = beaker.xPos;
        beakerMesh.top.position.x = beaker.xPos;
        sphere.position.x = object.xPos;
        cyl.position.x = object.xPos;
        cube.position.x = object.xPos;
        cone.position.x = object.xPos;
        rope.position.x = object.xPos;

        FORCEM.changeXPosition(object.xPos);

        //change the hanging thing
        holder.geometry.dispose();
        holder.position.x = ruler.position.x + (object.xPos - ruler.position.x)/2
        holder.geometry = new THREE.BoxGeometry( object.xPos - ruler.position.x + 0.02, 0.01, 0.015 );
    } 

    //change water level 0.3 to 0.65 depending on height
    let levelPerc = 2.915*height + 0.0083;
    levelPerc = levelPerc>0.65 ? 0.65 : levelPerc;
    beaker.waterHeight = height * levelPerc;
    beaker.mixedHeight = beaker.waterHeight;

    //change max radius
    if (radius > 0.069){
        changeRadius.setAttribute("max", 500);//5cm
    }
    else {
        changeRadius.setAttribute("max", Math.round(radius*2*100*0.7)/2*100);
    }

    //Write the volume and the accuracy of the beaker
    // if (isError){
    //     beakerVolume.textContent = Number((height*radius*radius*Math.PI*1000*1).toPrecision(2)).toLocaleString() + "L ± " + Number(beaker.accuracy.toPrecision(2)).toLocaleString() + "ml"
    // }
    // else{
    //     beakerVolume.textContent = Number((height*radius*radius*Math.PI*1000*1).toPrecision(2)).toLocaleString() + "L ± " + 1 + "ml";
    // }
    //write the starting volume of water
    beaker.startVolume = beaker.waterHeight*radius*radius*Math.PI*1000*1000*1;
    document.getElementById("startVolumeText").textContent = Math.round(beaker.startVolume) + "ml";


    //reset scene to avoid errors
    changeRadius.dispatchEvent(new Event("input"));

}

export function refreshBeakerVolume(){
    redrawBeaker(beaker.radius, beaker.height);
}


function getVolume(geometry) {
    let position = geometry.attributes.position;
    let faces = position.count / 3;
    let sum = 0;
    let p1 = new THREE.Vector3(),
        p2 = new THREE.Vector3(),
        p3 = new THREE.Vector3();
    for (let i = 0; i < faces; i++) {
        p1.fromBufferAttribute(position, i * 3 + 0);
        p2.fromBufferAttribute(position, i * 3 + 1);
        p3.fromBufferAttribute(position, i * 3 + 2);
        sum += signedVolumeOfTriangle(p1, p2, p3);
    }
    return sum;
}

function signedVolumeOfTriangle(p1, p2, p3) {
    return p1.dot(p2.cross(p3)) / 6.0;
}
      
      

function updateForcemeterRandom(){
    forceMeter.randomFactor = Math.random()*2-1;
}

function placeRope(low, high, type){
    //if rope is stretched rotate randomly the rope
    if (high - low >= 0.3){
        if (Math.random() > 0.5) {
            rope.rotation.y = -2.2;
        }
        else{
            rope.rotation.y = -0.7;
        }
    }
    rope.position.y = low;

    //let curve = calculateRopePosition(low, high, type);
    let segments = 100;

    //console.log(curve.getLength());
    let points = []; 

    //constrain in order to not pass through object
    //Sphere
    if (type == "sphere"){
        let ratio = (0.3 - high + low)/0.3;
        let curve = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( 0, (high - low), 0 ),
            new THREE.Vector3( 0, (high - low)-0.01, 0 ),
            new THREE.Vector3( 1/(1 + Math.exp(5-100*ratio))*0.01, (-ratio)*0.15+0.06, 0),
            new THREE.Vector3( 1/(1 + Math.exp(5-100*ratio))*0.01, (-ratio)*0.15+0.03, 0),
            new THREE.Vector3( 0, 0.005, 0 ),
            new THREE.Vector3( 0, 0, 0 )
        ]);
        curve.tension = 0.001;

        points = curve.getPoints( segments );

        let heightMaxDist;
        let maxDist = 0;
    
        for (let i = 1 ; i < segments ; i++){
            let distance = distanceBetweenPoints(points[i].x + object.xPos, points[i].y + low, points[i].z, object.xPos, object.height - object.radius, 0);
    
    
            if (distance < object.radius){
                //let distance = object.radius - inside;
    
                if (points[i].x > 0){
                    points[i].x += Math.sqrt(object.radius*object.radius - distance*distance);
                }
                else {
                    points[i].x -= Math.sqrt(object.radius*object.radius - distance*distance);
                }
            }
            if(Math.abs(points[i].x) > maxDist){
                maxDist = points[i].x;
                heightMaxDist = points[i].y;
            }
            if(points[i].y <= points[i-1].y && points[i].y < heightMaxDist){
                points[i].x = points[i-1].x;
            }
            else if(points[i].y >= points[i-1].y  &&  heightMaxDist > points[i].y ){
                points[i].x = maxDist - 0.003;
            }
    
        }
    }
    else if (type == "cylinder"){
        let segLength = 0.3/(segments);
        let ropeDiff = 0.3 - (high - low);
        let catSwitch = Math.floor(ropeDiff/segLength);
        let i = 0;
        let startLoop = 0;
        let angle = 0;



        // set points in straight line
        for (; i < catSwitch; i++){
            if(i*segLength/2 < object.radius){
                points.push( new THREE.Vector3( i*segLength/2, 0.001, 0 ) );
                startLoop++;
            }
            else {
                //points.push( new THREE.Vector3( object.radius, -(i-startLoop)*segLength, 0 ) );
            }
        }

        let pointsLoop = i - startLoop;
        i = startLoop;
        pointsLoop /= 2.2;
        if(Math.ceil(pointsLoop) > 1){

            let k = 0;
            for (; k < pointsLoop; k++){
                points.push( new THREE.Vector3( object.radius + 0.001, -(k+1)*segLength, 0 ) );
                i++;
            }
            for (; k < 2*pointsLoop; k++){
                angle = pointsLoop/200;
                let x = (object.radius  + 0.001)* Math.cos(angle);
                let z = (object.radius  + 0.001)* Math.sin(angle);
                points.push( new THREE.Vector3( x, -(2*pointsLoop-k-1)*segLength, z ) );
                i++;
            }
        }

        if (i < 2){
            //straight line
            for (; i < segments; i++){
                points.push( new THREE.Vector3( 0 , i*segLength, 0 ) );
            }
        }

        let iNow = i;
        let dx = points[iNow-1].x;
        let left = 100-iNow;

        for (; i < segments; i++){
            let a = (high - low)/dx/dx;
            let x = (dx/left)*(i-iNow)* Math.cos(angle);
            let y = a*(x*x);
            let z = (dx/left)*(i-iNow)* Math.sin(angle);
            //console.log(y);
            points.push( new THREE.Vector3( -x+points[iNow-1].x , y + 0.001, -z + points[iNow-1].z ) );
        }

    }
    else if (type == "cube"){
        let segLength = 0.3/(segments);
        let ropeDiff = 0.3 - (high - low);
        let catSwitch = Math.floor(ropeDiff/segLength);
        let i = 0;
        let startLoop = 0;
        let angle = 0;



        // set points in straight line
        for (; i < catSwitch; i++){
            if(i*segLength/2 < 0.5*object.radius){
                points.push( new THREE.Vector3( i*segLength/2, 0.001, 0 ) );
                startLoop++;
            }
            else {
                //points.push( new THREE.Vector3( object.radius, -(i-startLoop)*segLength, 0 ) );
            }
        }

        let pointsLoop = i - startLoop;
        i = startLoop;
        pointsLoop /= 2.2;
        if(Math.ceil(pointsLoop) > 1){

            let k = 0;
            for (; k < pointsLoop; k++){
                points.push( new THREE.Vector3( 0.5*object.radius + 0.001, -(k+1)*segLength, 0 ) );
                i++;
            }
            for (; k < 2*pointsLoop; k++){
                angle = pointsLoop/200;
                let x = (0.5*object.radius  + 0.001)* Math.cos(angle);
                let z = (0.5*object.radius  + 0.001)* Math.sin(angle);
                points.push( new THREE.Vector3( x, -(2*pointsLoop-k-1)*segLength, z ) );
                i++;
            }
        }

        if (i < 2){
            //straight line
            for (; i < segments; i++){
                points.push( new THREE.Vector3( 0 , i*segLength, 0 ) );
            }
        }

        let iNow = i;
        let dx = points[iNow-1].x;
        let left = 100-iNow;

        for (; i < segments; i++){
            let a = (high - low)/dx/dx;
            let x = (dx/left)*(i-iNow)* Math.cos(angle);
            let y = a*(x*x);
            let z = (dx/left)*(i-iNow)* Math.sin(angle);
            //console.log(y);
            points.push( new THREE.Vector3( -x+points[iNow-1].x , y + 0.001, -z + points[iNow-1].z ) );
        }

    }
    else if (type == "cone"){
        let segLength = 0.3/(segments);
        let ropeDiff = 0.3 - (high - low);
        let catSwitch = Math.floor(ropeDiff/segLength);
        let i = 0;
        let startLoop = 0;
        let angle = 0;



        // set points in straight line
        for (; i < catSwitch; i++){
            if(i*segLength/2 < 0.01*object.radius){
                points.push( new THREE.Vector3( i*segLength/2, 0.001, 0 ) );
                startLoop++;
            }
            else {
                //points.push( new THREE.Vector3( object.radius, -(i-startLoop)*segLength, 0 ) );
            }
        }

        let pointsLoop = i - startLoop;
        i = startLoop;
        pointsLoop /= 2.2;
        if(Math.ceil(pointsLoop) > 1){
            let slopeFactor = Math.sqrt(object.c*object.c + object.radius*object.radius)/object.c;

            let k = 0;
            for (; k < pointsLoop; k++){
                let y = -(k+1)*segLength/slopeFactor;
                let coneRadius = -y/object.c*object.radius;
                if (coneRadius > object.radius){
                    coneRadius = object.radius;
                }
                let x = coneRadius;
                points.push( new THREE.Vector3( x + 0.001, y, 0 ) );
                i++;
            }
            for (; k < 2*pointsLoop; k++){
                let y = -(2*pointsLoop-k-1)*segLength/slopeFactor;
                let coneRadius = -y/object.c*object.radius;
                if (coneRadius > object.radius){
                    coneRadius = object.radius;
                }
                angle = pointsLoop/200;
                let x = coneRadius*Math.cos(angle);
                let z = coneRadius*Math.sin(angle);
                points.push( new THREE.Vector3( x, y, z ) );
                i++;
            }
        }

        if (i < 2){
            //straight line
            for (; i < segments; i++){
                points.push( new THREE.Vector3( 0 , i*segLength, 0 ) );
            }
        }

        let iNow = i;
        let dx = points[iNow-1].x + 0.00001;
        let left = 100-iNow;

        for (; i < segments; i++){
            let a = (high - low)/dx/dx;
            let x = (dx/left)*(i-iNow)* Math.cos(angle);
            let y = a*(x*x);
            let z = (dx/left)*(i-iNow)* Math.sin(angle);
            //console.log(y);
            points.push( new THREE.Vector3( -x+points[iNow-1].x , y + 0.001, -z + points[iNow-1].z ) );
        }

    }

    
    

    rope.geometry.dispose();
    rope.geometry = new THREE.BufferGeometry().setFromPoints( points );

}

function calculateRopePosition(low, high, type){
    let length;
    let curve2;



    if (type == "sphere"){

    }
    else if (type == cylinder){
        return 0;

        

    }

    
    return curve2;
}


function getSubmergedVolumeAdv(object, fluid){
    //let array = [];
    const csgEvaluator = new Evaluator();
    const brush1 = new Brush( object.geometry );
    brush1.position.y = object.position.y;
    
    const brush2 = new Brush( fluid.geometry );
    brush2.position.y = fluid.position.y;

    brush1.updateMatrixWorld();
    brush2.updateMatrixWorld();

    let inters = csgEvaluator.evaluate( brush1, brush2, INTERSECTION );

    //for (let i = beaker.yPos; i < 0.7; i += 0.001){
    //    brush1.position.y = i;
    //    brush1.updateMatrixWorld();
    //    inters = csgEvaluator.evaluate( brush1, brush2, INTERSECTION );
    //    array.push(computeMeshVolume(inters));
    //    //console.log(computeMeshVolume(inters));
    //}

    //console.log(computeMeshVolume(inters));

    return computeMeshVolume(inters);
    //return array;

}

function getSubmergedVolume(type, highPoint){
    if (type == "sphere"){
        let lowPoint = object.height - 2*object.radius;
        let h = highPoint - lowPoint;//>0 if submerged
        if (h<=0){
            return [0, 0];
        }
        else if (h < 2* object.radius){
            let circumference = 2*Math.PI*Math.sqrt(2*object.radius*h-h*h);
            return [Math.PI*h*h/3*(3*object.radius-h), circumference];
        }
        else {
            return [4/3*Math.PI*object.radius*object.radius*object.radius, 0];
        }
    }
    else if (type == "cylinder"){
        let lowPoint = object.height - object.c;
        let h = highPoint - lowPoint;//>0 if submerged
        if (h<=0){
            return [0, 0];
        }
        else if (h < object.c){
            let circumference = 2*Math.PI*object.radius;
            return [Math.PI*object.radius*object.radius*h, circumference];
        }
        else {
            return [Math.PI*object.radius*object.radius*object.c, 0];
        }
    }
    else if (type == "cube"){
        let lowPoint = object.height - object.c;
        let h = highPoint - lowPoint;//>0 if submerged
        if (h<=0){
            return [0, 0];
        }
        else if (h < object.c){
            let circumference = 4*object.radius;
            return [object.radius*object.radius*h, circumference];
        }
        else {
            return [object.radius*object.radius*object.c, 0];
        }
    }
    else if (type == "cone"){
        let lowPoint = object.height - object.c;
        let h = highPoint - lowPoint;//>0 if submerged
        if (h<=0){
            return [0, 0];
        }
        else if (h < object.c){
            let totalVolume = 1/3*Math.PI*object.radius*object.radius*object.c;
            let smallh = object.c-h;
            let smallr = object.radius*smallh/object.c;
            let smallCone = 1/3*Math.PI*smallr*smallr*smallh;
            //let smallCone =  totalVolume*(object.c-h)/object.c;
            let circumference = 2*Math.PI*(Math.sqrt(3*smallCone/Math.PI/(object.c-h)));

            //console.log(totalVolume + ",  " + smallCone);
            return [totalVolume-smallCone, circumference];

        }
        else {
            return [1/3*Math.PI*object.radius*object.radius*object.c, 0];
        }
    }
}

function initialiseMeshObject(type){
    if (type == "sphere"){
        scene.add(sphere);
    }
    else if (type == "cylinder"){
        scene.add(cyl);
    }
    else if (type == "cube"){
        scene.add(cube);
    }
    else if (type == "cone"){
        scene.add(cone);
    }
    //will fix this later
    let mode = document.querySelector('input[type=radio][name="tgmass"]:checked').value;
    if ( mode == "density"){
        if (object.mat == 'pine' || object.mat == 'walnut' || object.mat == 'coal'){
            updateMatt(false, object.mat);
        }
        else{
            updateMatt(true, object.color);
        }
    }
    else{
        updateMatt(true, 0xff0000);
    }

}
initialiseMeshObject(object.type);

function removeObject(type){
    if (type == "sphere"){
        scene.remove(sphere);
    }
    else if (type == "cylinder"){
        scene.remove(cyl);
    }
    else if (type == "cube"){
        scene.remove(cube);
    }
    else if (type == "cone"){
        scene.remove(cone);
    }
}

function updateObjectMesh(type){
    if (type == "sphere"){
        sphere.scale.setScalar(object.radius/0.04);
    }
    else if (type == "cylinder"){
        cyl.geometry.dispose();
        cyl.geometry  = new THREE.CylinderGeometry( object.radius, object.radius, object.c, 32, 1 );
    }
    else if (type == "cube"){
        cube.geometry.dispose();
        cube.geometry  = new THREE.BoxGeometry( object.radius, object.c, object.radius );
    }
    else if (type == "cone"){
        cone.geometry.dispose();
        cone.geometry  = new THREE.ConeGeometry( object.radius, object.c, 32 ); 
    }
}

function updateObjectPosition(type, height){
    let heightShow = height- beaker.yPos;
    
    if (type == "sphere"){
        sphere.position.y = height - object.radius;
        heightShow -= 2*object.radius;
    }
    else if (type == "cylinder"){
        cyl.position.y = height - object.c/2;
        heightShow -= object.c;
    }
    else if (type == "cube"){
        cube.position.y = height - object.c/2;
        heightShow -= object.c;
    }
    else if (type == "cone"){
        cone.position.y = height - object.c/2;
        heightShow -= object.c;
    }

    measurments.heightF = calculateErrorHeight(heightShow);
    measurments.heightW = calculateErrorHeight(heightShow - beaker.mixedHeight);

    if (document.getElementById("chooseHeightTypeInfo").textContent == "Έδαφος"){
        heightText.textContent = measurments.heightF.toFixed(1).replace(".", ",")    + " cm";
    }
    else{
        heightText.textContent = measurments.heightW.toFixed(1).replace(".", ",")    + " cm";
    }   
    heightBottom = heightShow;
}
let heightBottom = 0.5;



let timePrev = 0;
function render( time ) {
    //var start = new Date().getTime();

    //time *= 0.001; // convert time to seconds
    const dt = time - timePrev;
    timePrev = time;


    calculateNewPosition(dt, object.type);
    updateObjectPosition(object.type, object.height);



    cylinder.geometry.dispose();
    cylinder.geometry = new THREE.CylinderGeometry( beaker.radius, beaker.radius, beaker.mixedHeight, 32, 1 );
    cylinder.position.y = beaker.yPos+beaker.mixedHeight/2;
    //volumeText.style.bottom = (beaker.yPos + beaker.mixedHeight - 0.03)*100 + "%";
    //volumeText.style.left = (object.xPos - beaker.radius - 0.105)*100*3/4 + "%";
    //measurments.volume = Math.round(beaker.mixedHeight*Math.PI*beaker.radius*beaker.radius/beaker.accuracy*1000000)*beaker.accuracy;
    measurments.volume = calculateVolume(beaker.mixedHeight, beaker.radius, beaker.accuracy);
    document.getElementById("totalVolumeText").textContent = Math.round(measurments.volume) + "ml";
    document.getElementById("diffVolumeText").textContent = Math.round((measurments.volume-beaker.startVolume)) + "ml";

    if (ui.upBtn){

        if (FORCEM.height < 0.8) {
            //updateForcemeterRandom();
            audioMachine.play();
            FORCEM.changeVarHeight(FORCEM.height + 0.002/16.7*dt)
            //FORCEM.height += 0.002/16.7*dt;
        }
    }
    else if (ui.downBtn){
        if (FORCEM.height > 0.45){
            //updateForcemeterRandom();
            audioMachine.play();
            FORCEM.changeVarHeight(FORCEM.height - 0.002/16.7*dt)
            //FORCEM.height -= 0.002/16.7*dt;
        }
    }
    else{
        audioMachine.currentTime = 0;
        audioMachine.pause();
    }


    updateLineHeight();
    updateLineVolume();

    moveCameraStep(camera, cameraDimention, 0.1);



    

    renderer.render( scene, camera );
    //renderer.info.reset(); 
    //process.stdout.write("\r\x1b[K");
    
    //console.log(renderer.info);


    requestAnimationFrame( render );

}

requestAnimationFrame( render );

resizeCanvas();

changeRadius.dispatchEvent(new Event("input"));

//the line that shows what height means
const materialLineHeight = new THREE.LineBasicMaterial({
	color: 0xff0000
});
const pointsLineHeight = [];
pointsLineHeight.push( new THREE.Vector3(object.xPos + 0.00, beaker.yPos, 0 ) );
pointsLineHeight.push( new THREE.Vector3( object.xPos + 0.00, beaker.yPos, 0  ) );
pointsLineHeight.push( new THREE.Vector3( beaker.radius + object.xPos + 0.02, object.height, 0 ) );
pointsLineHeight.push( new THREE.Vector3( object.xPos + 0.00, beaker.yPos, 0  ) );
pointsLineHeight.push( new THREE.Vector3( beaker.radius + object.xPos + 0.02, object.height, 0 ) );
pointsLineHeight.push( new THREE.Vector3( beaker.radius + object.xPos + 0.02, 0.39, 0 ) );
pointsLineHeight.push( new THREE.Vector3( beaker.radius + object.xPos + 0.12, 0.39, 0 ) );
pointsLineHeight.push( new THREE.Vector3( 0, 0, 0 ) );

const geometryLineHeight = new THREE.BufferGeometry().setFromPoints( pointsLineHeight );

const lineHeight = new THREE.Line( geometryLineHeight, materialLineHeight );
//scene.add( lineHeight );

function updateLineHeight(){
    let theta;
    if (heightBottom > 0.1){
        theta = 1.414/2;
    }
    else{
        theta = Math.sin(Math.PI/0.4 * heightBottom);
    }
    lineHeight.geometry.attributes.position.setXYZ(0, object.xPos - 0.02*1.414/2 + 0.00, beaker.yPos + 0.02*theta, 0 );
    lineHeight.geometry.attributes.position.setXYZ(1, object.xPos + 0.00, beaker.yPos, 0 );
    lineHeight.geometry.attributes.position.setXYZ(2, object.xPos + 0.02*1.414/2 + 0.00, beaker.yPos + 0.02*theta, 0 );
    lineHeight.geometry.attributes.position.setXYZ(3, object.xPos + 0.00, beaker.yPos, 0 );
    lineHeight.geometry.attributes.position.setXYZ(4, object.xPos + 0.00, beaker.yPos + heightBottom, 0 );
    lineHeight.geometry.attributes.position.setXYZ(5, object.xPos - 0.02*1.414/2, beaker.yPos - 0.02*theta + heightBottom, 0 );
    lineHeight.geometry.attributes.position.setXYZ(6, object.xPos + 0.00, beaker.yPos + heightBottom, 0 );
    lineHeight.geometry.attributes.position.setXYZ(7, object.xPos + 0.02*1.414/2, beaker.yPos - 0.02*theta + heightBottom, 0 );
    lineHeight.geometry.attributes.position.needsUpdate = true;

}



//the line that shows the wwater volume
const materialLineVolume = new THREE.LineBasicMaterial({
	color: 0x0000ff
});
const pointsLineVolume = [];
pointsLineVolume.push( new THREE.Vector3( -beaker.radius + object.xPos - 0.00, beaker.mixedHeight + beaker.yPos, 0 ) );
pointsLineVolume.push( new THREE.Vector3( -beaker.radius + object.xPos - 0.02, beaker.mixedHeight + beaker.yPos, 0 ) );
pointsLineVolume.push( new THREE.Vector3( -beaker.radius + object.xPos - 0.02, beaker.yPos - 0.06, 0 ) );
pointsLineVolume.push( new THREE.Vector3( -beaker.radius + object.xPos - 0.12, beaker.yPos - 0.06, 0 ) );
pointsLineVolume.push( new THREE.Vector3(0, 0, 0) );

const geometryLineVolume = new THREE.BufferGeometry().setFromPoints( pointsLineVolume );

const lineVolume = new THREE.Line( geometryLineVolume, materialLineVolume );
scene.add( lineVolume );

function updateLineVolume(){
    lineVolume.geometry.attributes.position.setXYZ(0, beaker.radius + object.xPos + 0.01*1.414/2, beaker.mixedHeight + beaker.yPos + 0.01*1.414/2, 0  );
    lineVolume.geometry.attributes.position.setXYZ(1, beaker.radius + object.xPos - 0.00, beaker.mixedHeight + beaker.yPos, 0  );
    lineVolume.geometry.attributes.position.setXYZ(2, beaker.radius + object.xPos + 0.01*1.414/2, beaker.mixedHeight + beaker.yPos - 0.01*1.414/2, 0  );
    lineVolume.geometry.attributes.position.setXYZ(3, beaker.radius + object.xPos - 0.00, beaker.mixedHeight + beaker.yPos, 0  );
    lineVolume.geometry.attributes.position.setXYZ(4, beaker.radius + object.xPos + 0.18, beaker.mixedHeight + beaker.yPos, 0  );
    lineVolume.geometry.attributes.position.needsUpdate = true;


    const unitW = canvas.width;
    let a = unitW/(canvas.width / canvas.height) //pixel/m
    volumeText.style.left = (unitW/2+a*(-offsetX+beaker.radius*1.2))/window.devicePixelRatio + "px";

    

    if (cameraDimention == "3D"){
        volumeText.style.bottom = ((a*(beaker.mixedHeight+beaker.yPos-0.01))/window.devicePixelRatio - volumeText.getBoundingClientRect().height/2) + "px";
    }
    else{
        volumeText.style.bottom = ((a*(beaker.mixedHeight+beaker.yPos))/window.devicePixelRatio - volumeText.getBoundingClientRect().height/2) + "px";
    }
}




function calculateVolume(mixedHeight, beakerRadius, accuracy){
    let volume = mixedHeight*Math.PI*beakerRadius*beakerRadius * 1000000; //in ml
    volume = calculateErrorBeaker(volume, accuracy);

    return volume;
}



document.getElementById("chooseHeightTypeInfo").onclick = function(){
    let i = document.getElementById("chooseHeightTypeInfo");
    if (i.textContent == "Έδαφος"){
        i.textContent = "Επιφάνεια υγρού";
    }
    else{
        i.textContent = "Έδαφος";
    }
}