//Add a backround to the main scene. Also adds the table.

import * as THREE from 'three';

export function drawBackground(scene, beakerHeight){
    scene.background = new THREE.Color( 0xadd8e6 );

    let table = {
        width : 0.5,
        height : 0.02,
        length : 4
    }

    //Add the table
    const geometryFloor = new THREE.BoxGeometry( table.length, table.height,  table.width);
    const materialFloor = new THREE.MeshPhongMaterial( { color: 0xeeeebb } );
    const floor = new THREE.Mesh( geometryFloor, materialFloor );
    scene.add(floor);
    floor.position.y = beakerHeight - table.height/2 -0.002; //beaker bottom height minus a bit for the glass
    

    let underTable = {
        width : 0.02,
        height : 1,
        length : 4
    }
    //Add the underside of the Table
    const backUnder = new THREE.Mesh( new THREE.BoxGeometry( underTable.length, underTable.height,  underTable.width), new THREE.MeshPhongMaterial( { color: 0xffffff } ));
    scene.add(backUnder);
    backUnder.position.y = beakerHeight - underTable.height/2 -0.01;
    backUnder.position.z = -table.width/2 + underTable.width;
}

