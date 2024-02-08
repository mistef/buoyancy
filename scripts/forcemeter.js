import * as THREE from 'three';
import {calculateErrorForce, isError} from './errors.js'

const forceText = document.getElementById('forceInfo');

let height = 0.8;

let tube, spring, indicator, tubeTap, rod; //meshes

let canvasTube = document.createElement('canvas');
let ctxTube = canvasTube.getContext('2d');;

let canvasSpring = document.createElement('canvas');
let springCtx = canvasSpring.getContext('2d');

let textureSpring;

let displacement = 0;
let randomFactor = 0;
let maxForce = 5;


export {height, maxForce, displacement};

export function drawForceMeter(scene, objX, objH){
    //First draw the tube
    let tubeLength = 0.10;
    let tubeRadius = 0.007;
    let textureTube = new THREE.CanvasTexture(canvasTube);

    const tubeGeometry = new THREE.CylinderGeometry( tubeRadius, tubeRadius, tubeLength, 32, 1 );
    const tubeMaterial = new THREE.MeshBasicMaterial( {map: textureTube, transparent: true} );
    tube = new THREE.Mesh( tubeGeometry, tubeMaterial );
    scene.add(tube);
    tube.position.x = objX;
    tube.position.y = objH + 0.3;
    //forceMeter.tube.material.opacity = 0.3;
    tube.renderOrder = 1;

    canvasTube.width = 1000*2*Math.PI*(tubeRadius);
    canvasTube.height = 1000*tubeLength;   //in mm
    ctxTube.fillStyle = 'rgba(200, 200, 200, 0.5)';
    ctxTube.fillRect(0, 0, canvasTube.width, canvasTube.height);
    for (let i = canvasTube.height/2; i < canvasTube.height; i+=3){
        // Start a new Path
        ctxTube.beginPath();
        ctxTube.moveTo(canvasTube.width-1, i);
        ctxTube.lineTo(canvasTube.width-7, i);

        // Draw the Path
        ctxTube.stroke();
    }


    //draw the cylinder for the spring
    let springLength = 0.05;
    let springSteps = 10;
    textureSpring = new THREE.CanvasTexture(canvasSpring);

    const springGeometry = new THREE.CylinderGeometry( tubeRadius-0.001, tubeRadius-0.001, springLength, 32, 1, true );
    const springMaterial = new THREE.MeshBasicMaterial( { map: textureSpring, transparent: true } );
    spring = new THREE.Mesh( springGeometry, springMaterial );

    scene.add(spring);
    spring.position.x = objX;
    spring.material.side = THREE.DoubleSide;
    canvasSpring.width = 1000*2*Math.PI*(tubeRadius-0.001);
    canvasSpring.height = 1000*springLength;   //in mm
    let distancePerStep = canvasSpring.height/springSteps;
    for (let i = 0; i < springSteps; i++){
        // Start a new Path
        springCtx.beginPath();
        springCtx.moveTo(0, i*distancePerStep);
        springCtx.lineTo(canvasSpring.width, (i+1)*distancePerStep);

        // Draw the Path
        springCtx.stroke();
    }

    //Draw the tap
    //First the Force indicator
    const indicatorGeometry = new THREE.CylinderGeometry( tubeRadius-0.0005, tubeRadius-0.0005, 0.002, 32, 1 );
    const indicatorMaterial = new THREE.MeshBasicMaterial( {color: 800080} );
    indicator = new THREE.Mesh( indicatorGeometry, indicatorMaterial );
    scene.add(indicator);
    indicator.position.x = objX;
    //The Bottom tap
    const tapGeometry = new THREE.CylinderGeometry( tubeRadius-0.0005, tubeRadius-0.0005, 0.002, 32, 1 );
    tubeTap = new THREE.Mesh( tapGeometry, indicatorMaterial );
    scene.add(tubeTap);
    tubeTap.position.x = objX;
    //The Connecting Rod
    const rodGeometry = new THREE.CylinderGeometry( 0.002, 0.002, 0.053, 32, 1 );
    rod = new THREE.Mesh( rodGeometry, indicatorMaterial );
    scene.add(rod);
    rod.position.x = objX;

    


}

export function changeXPosition(x){
    tube.position.x = x;
    spring.position.x = x;
    indicator.position.x = x;
    tubeTap.position.x = x;
    rod.position.x = x;
}

//Changes the forcermeter. Needs to pass holder and returns the force for the measurement
export function placeForceMeter(displ, holder){
    holder.position.y = height + 0.1;
    
    tube.position.y = height+0.05;
    //spring.position.y = height+0.375;
    indicator.position.y = height+0.05;
    tubeTap.position.y = height - 0.003;
    rod.position.y = height + 0.0235;

    //convert force to displacement 0-5N -> 0-5cm
    //let displacement = force * 0.01;
    
    //forceMeter.displacement = force * 0.01;
    //forceMeter.displacement = forceMeter.displacement < -0.05 ? -0.05 : forceMeter.displacement;

    displacement = -displ;
    
    displacement = displacement < -0.05 ? -0.05 : displacement;

    indicator.position.y += displacement;
    rod.position.y += displacement;

    //change spring
    spring.geometry.dispose();
    spring.geometry = new THREE.CylinderGeometry( 0.006, 0.006, (0.05-displacement), 32, 1, true );
    spring.position.y = height + 0.05 + (0.05 + displacement)/2;

    springCtx.clearRect(0, 0, canvasSpring.width, canvasSpring.height);
    canvasSpring.height = 1000*(0.05 - displacement);   //in mm
    let distancePerStep = canvasSpring.height/10;
    for (let i = 0; i < 10; i++){
        // Start a new Path
        springCtx.beginPath();
        springCtx.moveTo(0, i*distancePerStep);
        springCtx.lineTo(canvasSpring.width, (i+1)*distancePerStep);

        // Draw the Path
        springCtx.stroke();
    }
    //spring.material.map.needsUpdate = true;
    textureSpring.dispose();
    textureSpring = new THREE.CanvasTexture(canvasSpring);
    spring.material.map = textureSpring;

    //Force text
    let textHeight = (height + 0.04);

    let force =  -displacement/0.05*maxForce; //in N

    let accuracy = maxForce/100;

    if (force > accuracy && force < (maxForce-accuracy)){
        force += randomFactor*accuracy;
    }
    
    //force = Math.round(force/accuracy)*accuracy;
    force = calculateErrorForce(force, accuracy);

    //forceText.style.top = (100 - textHeight*100) + "%";

    let numPres = 2;
    switch (maxForce) {
        case 1:
            numPres = 2 + !isError;
            break;
        case 5:
            numPres = 2;
            break;
        case 10:
            numPres = 1 + !isError;
            break;
        case 50:
            numPres = 1;
            break;
        case 100:
            numPres = 0 + !isError;
            break;
    }
    forceText.textContent = "F:" + force.toFixed(numPres).replace(".", ",") + " N";

    return parseFloat(force.toFixed(numPres));
    //measurments.force = parseFloat(force.toFixed(numPres));
    //console.log(typeof force.toPrecision(2));
    
}

export function changeVarHeight(h){
    height = h;
}

export function changeMaxForce(value){
    maxForce = value;
}
