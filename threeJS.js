import*as e from"three";!function(){var e=document.createElement("script");e.onload=function(){var e=new Stats;document.body.appendChild(e.dom),requestAnimationFrame(function t(){e.update(),requestAnimationFrame(t)})},e.src="https://mrdoob.github.io/stats.js/build/stats.min.js",document.head.appendChild(e)}();let canvas=document.querySelector("#canvas1"),container=document.getElementById("container"),increaseHeight=document.getElementById("buttonUp"),reduceHeight=document.getElementById("buttonDown"),changeRadius=document.getElementById("radiusSlider"),massSlider=document.getElementById("massSlider"),saltSlider=document.getElementById("saltSlider"),heightSlider=document.getElementById("heightSlider"),incBeakerHeightBtn=document.getElementById("incHeight"),decBeakerHeightBtn=document.getElementById("decHeight"),incBeakerRadiusBtn=document.getElementById("incRadius"),decBeakerRadiusBtn=document.getElementById("decRadius"),beakerHeightValue=document.getElementById("beakerHeightValue"),beakerRadiusValue=document.getElementById("beakerRadiusValue"),beakerVolume=document.getElementById("beakerVolume"),radioShape=document.querySelectorAll('input[type=radio][name="rShape"]'),radioMass=document.querySelectorAll('input[type=radio][name="tgmass"]'),heightText=document.getElementById("heightInfo"),radiusText=document.getElementById("radiusInfo"),cText=document.getElementById("cInfo"),forceText=document.getElementById("forceInfo"),massText=document.getElementById("massInfo"),saltText=document.getElementById("saltText"),volumeText=document.getElementById("volumeText"),volumeObj=document.getElementById("volumeObj"),selectMat=document.getElementById("materialSelect"),selectList=document.getElementById("selectList"),fluidList=document.getElementById("fluidList"),incForce=document.getElementById("incForce"),decForce=document.getElementById("decForce"),forcemeterLimit=document.getElementById("forcemeterLimit"),record=document.getElementById("record"),xyValues=[];let object={xPos:.52,height:.5,speed:0,gravity:-9.81,mass:massSlider.value/100,radius:changeRadius.value/1e4,dragCoefficient:0,lengthSunk:0,ellipseFactor:0,c:heightSlider.value/1e4,type:"sphere",mat:"ABS",density:1100,color:3329330};"cube"==object.type&&(object.radius*=1.5),object.dragCoefficient=.3055*object.radius*object.radius*Math.PI*1,object.ellipseFactor=object.radius/3;let maxFall=.15,forceMeter={height:.8,tube:0,canvasTube:document.createElement("canvas"),ctxTube:0,spring:0,canvasSpring:document.createElement("canvas"),springCtx:0,textureSpring:0,indicator:0,tubeTap:0,rod:0,displacement:0,randomFactor:0,maxForce:5};forceMeter.ctxTube=forceMeter.canvasTube.getContext("2d"),forceMeter.springCtx=forceMeter.canvasSpring.getContext("2d"),forcemeterLimit.textContent="("+forceMeter.maxForce+" \xb1 "+(forceMeter.maxForce/100).toLocaleString()+") N";let beaker={height:.22,xPos:0,yPos:.1,waterHeight:.143,mixedHeight:.143,radius:.07,density:997,ellipseFactor:0,saltContent:0,accuracy:1};beaker.xPos=object.xPos-beaker.radius,beaker.ellipseFactor=beaker.radius/3;let fluid={type:"water",density:997},ui={upBtn:!1,downBtn:!1},measurments={volume:1e3,force:5.1,height:.5,mass:.2,density:1e3,volumeObj:100,densityFl:997};function increment(){updateForcemeterRandom(),ui.upBtn&&(forceMeter.height<.8&&(forceMeter.height+=.001),setTimeout(()=>increment(),10))}function changeHandler(e){forceMeter.height=.8,object.height=.5,removeObject(object.type),object.type=this.value,changeRadius.dispatchEvent(new Event("input")),initialiseMeshObject(this.value),beaker.mixedHeight=beaker.waterHeight,"sphere"==this.value?(heightSlider.style.visibility="hidden",cText.style.visibility="hidden"):(heightSlider.style.visibility="visible",cText.style.visibility="visible")}function toggleMass(e){"density"==this.value?(massSlider.style.display="none",selectMat.style.display="block",massText.style.display="none",selectList.dispatchEvent(new Event("change")),"pine"==object.mat||"walnut"==object.mat?updateMatt(!1,object.mat):updateMatt(!0,object.color)):(massSlider.style.display="block",selectMat.style.display="none",massText.style.display="block",massSlider.dispatchEvent(new Event("input")),updateMatt(!0,16711680))}function disableBtn(e,t){"disable"==t?(e.disabled=!0,e.style.opacity=.6,e.style.cursor="not-allowed"):(e.disabled=!1,e.style.opacity=1,e.style.cursor="")}function resizeCanvas(){4*window.innerHeight/3<window.innerWidth?(canvas.height=window.innerHeight,canvas.width=4*window.innerHeight/3):(canvas.width=window.innerWidth,canvas.height=3*window.innerWidth/4),(canvas.width<700||canvas.height<525)&&(canvas.width=700,canvas.height=525),container.style.height=canvas.height+"px",container.style.width=canvas.width+"px",camera.updateProjectionMatrix(),renderer.setSize(canvas.width,canvas.height);let e=canvas.height>500?canvas.height:500;increaseHeight.style.height=e/20+"px",increaseHeight.style.width=e/20+"px",increaseHeight.style.borderRadius=e/60+"px",increaseHeight.style.fontSize=e/30+"px",reduceHeight.style.height=e/20+"px",reduceHeight.style.width=e/20+"px",reduceHeight.style.borderRadius=e/60+"px",reduceHeight.style.fontSize=e/30+"px",increaseHeight.style.left=canvas.width*(object.xPos+beaker.radius+.03)*3/4+"px",reduceHeight.style.left=canvas.width*(object.xPos+beaker.radius+.03)*3/4+"px",increaseHeight.style.top=.65*canvas.height+"px",reduceHeight.style.top=.65*canvas.height+e/20+10+"px",heightText.style.left=canvas.width*(object.xPos+beaker.radius+.03)*3/4+"px",heightText.style.top=.65*canvas.height-e/20+"px",volumeText.style.fontSize=e/40+"px",record.style.left=canvas.width*object.xPos*3/4-68.5+"px",forceText.style.left=canvas.width*object.xPos*3/4-90+"px"}increaseHeight.addEventListener("mousedown",function(){ui.upBtn=!0}),increaseHeight.addEventListener("mouseup",function(){ui.upBtn=!1}),increaseHeight.addEventListener("mouseleave",function(){ui.upBtn=!1}),increaseHeight.addEventListener("touchstart",function(){ui.upBtn=!0}),increaseHeight.addEventListener("touchend",function(){ui.upBtn=!1}),reduceHeight.addEventListener("mousedown",function(){ui.downBtn=!0}),reduceHeight.addEventListener("mouseup",function(){ui.downBtn=!1}),reduceHeight.addEventListener("mouseleave",function(){ui.downBtn=!1}),reduceHeight.addEventListener("touchstart",function(){ui.downBtn=!0}),reduceHeight.addEventListener("touchend",function(){ui.downBtn=!1}),changeRadius.addEventListener("input",function(){object.radius=changeRadius.value/1e4,"sphere"==object.type?(object.dragCoefficient=.3055*object.radius*object.radius*Math.PI,object.ellipseFactor=object.radius/3,radiusText.textContent="Ακτίνα: "+(100*object.radius).toFixed(1).toString().replace(".",",")+" cm"):"cylinder"==object.type?(object.dragCoefficient=.52*object.radius*object.radius*Math.PI,radiusText.textContent="Ακτίνα: "+(100*object.radius).toFixed(1).toString().replace(".",",")+" cm"):"cube"==object.type?(object.dragCoefficient=.65*object.radius*object.radius*Math.PI,object.radius*=1.5,radiusText.textContent="Ακμή: "+(100*object.radius).toFixed(1).toString().replace(".",",")+" cm"):"cone"==object.type&&(object.dragCoefficient=.3055*object.radius*object.radius*Math.PI,radiusText.textContent="Ακτίνα: "+(100*object.radius).toFixed(1).toString().replace(".",",")+" cm"),updateObjectMesh(object.type);"density"==document.querySelector('input[type=radio][name="tgmass"]:checked').value?calculateMass(object.density,object.type):(measurments.volumeObj=Math.round(1e6*getSubmergedVolume(object.type,1)[0]),volumeObj.textContent="V = "+measurments.volumeObj+"ml",measurments.density=measurments.mass/measurments.volumeObj)}),massSlider.addEventListener("input",function(){object.mass=10*massSlider.value/1e3,measurments.mass=object.mass,measurments.density=1e3*object.mass/measurments.volumeObj,massText.textContent="Μάζα: "+object.mass.toFixed(3).replace(".",",")+" kg"}),saltSlider.addEventListener("input",function(){let e=997+7.6*saltSlider.value;e=e>1193?1193:e,e*=1+(Math.random()-.5)/50,beaker.saltContent=saltSlider.value,saltText.textContent="NaCl: "+this.value+"% w/w",fluid.density=e}),heightSlider.addEventListener("input",function(){object.c=heightSlider.value/1e4,updateObjectMesh(object.type),cText.textContent="Ύψος: "+(100*object.c).toFixed(1).toString().replace(".",",")+" cm";"density"==document.querySelector('input[type=radio][name="tgmass"]:checked').value?calculateMass(object.density,object.type):(measurments.volumeObj=Math.round(1e6*getSubmergedVolume(object.type,1)[0]),volumeObj.textContent="V = "+measurments.volumeObj+"ml",measurments.density=measurments.mass/measurments.volumeObj)}),Array.prototype.forEach.call(radioShape,function(e){e.addEventListener("change",changeHandler)}),heightSlider.style.visibility="hidden",cText.style.visibility="hidden",Array.prototype.forEach.call(radioMass,function(e){e.addEventListener("change",toggleMass)}),massSlider.style.display="none",massText.style.display="none",massSlider.dispatchEvent(new Event("input")),selectList.addEventListener("change",function(){object.mat=this.value,changeMaterial(this.value)}),saltSlider.style.visibility="hidden",saltText.style.visibility="hidden",fluidList.addEventListener("change",function(){fluid.type=this.value;let t,r,o;switch(saltSlider.style.visibility="hidden",saltText.style.visibility="hidden",this.value){case"water":fluid.density=997,t=5592575,r=7829503,o=.45,saltSlider.style.visibility="hidden",saltSlider.value=0,saltText.style.visibility="hidden";break;case"oil":fluid.density=920,t=11839010,r=14997871,o=.6;break;case"ethanol":fluid.density=785,t=11184810,r=13421772,o=.3;break;case"glycerine":fluid.density=1260,t=11184810,r=13421772,o=.3}let i=[new e.MeshBasicMaterial({color:t,transparent:!0}),new e.MeshBasicMaterial({color:r,transparent:!0,side:e.DoubleSide}),new e.MeshBasicMaterial({color:t,transparent:!0,side:e.DoubleSide})];cylinder.material[0].dispose(),cylinder.material[1].dispose(),cylinder.material[2].dispose(),cylinder.material=i,cylinder.material[0].opacity=o,cylinder.material[1].opacity=o,cylinder.material[2].opacity=o,measurments.densityFl=fluid.density}),incBeakerHeightBtn.addEventListener("click",function(){beaker.height+=.01,disableBtn(decBeakerHeightBtn,"enable"),beaker.height>=.299&&disableBtn(incBeakerHeightBtn,"disable"),beakerHeightValue.textContent=(100*beaker.height).toPrecision(2)+"cm",redrawBeaker(beaker.radius,beaker.height)}),decBeakerHeightBtn.addEventListener("click",function(){beaker.height-=.01,disableBtn(incBeakerHeightBtn,"enable"),beaker.height<.101&&disableBtn(decBeakerHeightBtn,"disable"),beakerHeightValue.textContent=(100*beaker.height).toPrecision(2)+"cm",redrawBeaker(beaker.radius,beaker.height)}),incBeakerRadiusBtn.addEventListener("click",function(){beaker.radius+=.005,resizeCanvas(),disableBtn(decBeakerRadiusBtn,"enable"),beaker.radius>.099&&disableBtn(incBeakerRadiusBtn,"disable"),beakerRadiusValue.textContent=Number((100*beaker.radius).toPrecision(2)).toLocaleString()+"cm",redrawBeaker(beaker.radius,beaker.height)}),decBeakerRadiusBtn.addEventListener("click",function(){beaker.radius-=.005,resizeCanvas(),disableBtn(incBeakerRadiusBtn,"enable"),beaker.radius<.026&&disableBtn(decBeakerRadiusBtn,"disable"),beakerRadiusValue.textContent=Number((100*beaker.radius).toPrecision(2)).toLocaleString()+"cm",redrawBeaker(beaker.radius,beaker.height)}),incForce.addEventListener("click",function(){let e=forceMeter.maxForce;switch(disableBtn(decForce,"enable"),e){case 1:e=5;break;case 5:e=10;break;case 10:e=50;break;case 50:e=100,disableBtn(incForce,"disable")}forceMeter.maxForce=e,forcemeterLimit.textContent="("+e+" \xb1 "+(e/100).toLocaleString()+") N"}),decForce.addEventListener("click",function(){let e=forceMeter.maxForce;switch(disableBtn(incForce,"enable"),e){case 100:e=50;break;case 50:e=10;break;case 10:e=5;break;case 5:e=1,disableBtn(decForce,"disable")}forceMeter.maxForce=e,forcemeterLimit.textContent="("+e+" \xb1 "+(e/100).toLocaleString()+") N"}),window.addEventListener("resize",function(){resizeCanvas()});let renderer=new e.WebGLRenderer({antialias:!0,canvas});renderer.shadowMap.enabled=!0;let fov=18,aspect=4/3,near=.1,far=10,camera=new e.OrthographicCamera(0,4/3,1,0,.1,10);camera.position.z=9,camera.position.y=3,camera.lookAt(0,0,0);let scene=new e.Scene,loader=new e.TextureLoader;loader.load("textures/background.jpg",function(e){scene.background=e});{let t=new e.DirectionalLight(16777215,2);t.position.set(0,2,2),t.lookAt(-1,0,0);let r=new e.AmbientLight(16777215);scene.add(r);let o=new e.PointLight(16711680,1,100);o.position.set(0,2,-1),t.lookAt(-1,0,0);let i=new e.DirectionalLight(16777215,2);i.position.set(-1,1,2),i.lookAt(0,0,0),scene.add(i);let a=new e.DirectionalLight(4210752,20);a.position.set(0,0,2),a.lookAt(0,0,0)}function rk4(e,t){let r=calculateForce(e),o=calculateForce(e+.5*t*r),i=calculateForce(e+.5*t*o),a=calculateForce(e+t*i);return(r+2*o+2*i+a)/6}function calculateNewPosition(e,t){e=e>50?50:e;let r=(e/=1e3)/100;for(let o=0;o<100;o++){let i=calculateForce()/object.mass;object.speed+=i*r,object.height+=object.speed*r}let a,c=object.height;a=forceMeter.height-c>.3?forceMeter.height-c-.3:0,"sphere"==t?object.height<=2*object.radius+beaker.yPos&&(object.height=2*object.radius+beaker.yPos,object.speed=0):"cylinder"==t?object.height<=object.c+beaker.yPos&&(object.height=object.c+beaker.yPos,object.speed=0):"cube"==t?object.height<=object.c+beaker.yPos&&(object.height=object.c+beaker.yPos,object.speed=0):"cone"==t&&object.height<=object.c+beaker.yPos&&(object.height=object.c+beaker.yPos,object.speed=0),a>.05&&(c=forceMeter.height-.3-.05,object.height=c,object.speed=0),placeForceMeter(a),placeRope(c,forceMeter.height-a,t)}function calculateForce(){let e=object.type,t;t=object.mass*object.gravity;let[r,o]=getSubmergedVolume(e,beaker.yPos+beaker.mixedHeight);return 0==r?t+=-1*object.dragCoefficient*object.speed*Math.abs(object.speed):(beaker.mixedHeight=beaker.waterHeight+r/(Math.PI*beaker.radius*beaker.radius),t+=fluid.density*r*Math.abs(object.gravity),t+=-1*object.dragCoefficient*object.speed*Math.abs(object.speed)*(fluid.density/1.3),t+=-1*object.speed*o*1),forceMeter.displacement<0&&(t+=-forceMeter.maxForce/.05*forceMeter.displacement,t+=-forceMeter.maxForce*object.speed),t}function sphereCapVolume(e,t){return t<2*e?Math.PI*t*t/3*(3*e-t):4/3*Math.PI*e*e*e}let ruler,holder,canvasRuler=document.createElement("canvas"),ctxRuler=canvasRuler.getContext("2d");function initialiseScene(){canvasRuler.width=30,canvasRuler.height=850,ctxRuler.fillStyle="grey",ctxRuler.font="7px Arial",ctxRuler.fillRect(0,0,canvasRuler.width,canvasRuler.height);for(let t=0;t<canvasRuler.height;t+=10)ctxRuler.beginPath(),ctxRuler.moveTo(22,t),ctxRuler.lineTo(30,t),ctxRuler.stroke();for(let r=5;r<canvasRuler.height;r+=10)ctxRuler.beginPath(),ctxRuler.moveTo(25,r),ctxRuler.lineTo(30,r),ctxRuler.stroke();for(let o=10;o<=canvasRuler.height;o+=10)ctxRuler.fillStyle="black",ctxRuler.fillText((86-o/10).toString(),10,o-8);for(let i=canvasRuler.height;i>0;i-=50)ctxRuler.beginPath(),ctxRuler.moveTo(20,i),ctxRuler.lineTo(30,i),ctxRuler.stroke();ctxRuler.beginPath(),ctxRuler.moveTo(0,0),ctxRuler.lineTo(0,canvasRuler.height),ctxRuler.lineTo(canvasRuler.width,canvasRuler.height),ctxRuler.lineTo(canvasRuler.width,0),ctxRuler.lineTo(0,0),ctxRuler.stroke();let a=new e.CanvasTexture(canvasRuler),c=new e.BoxGeometry(.03,.85,.02),n=new e.MeshBasicMaterial({map:a});ruler=new e.Mesh(c,n),scene.add(ruler),ruler.position.x=object.xPos-.15,ruler.position.y=beaker.yPos+.425;let s=new e.BoxGeometry(object.xPos-ruler.position.x+.02,.01,.015),$=new e.MeshPhongMaterial({color:10382363});holder=new e.Mesh(s,$),scene.add(holder),holder.position.x=ruler.position.x+(object.xPos-ruler.position.x)/2,holder.position.y=forceMeter.height+.1;"density"==document.querySelector('input[type=radio][name="tgmass"]:checked').value&&calculateMass(object.density,object.type)}function changeMaterial(e){let t=100;switch(e){case"pine":t=500,updateMatt(!1,"pine",object.type);break;case"walnut":t=670,updateMatt(!1,"walnut",object.type);break;case"steel":t=8e3,updateMatt(!0,11580343,object.type),object.color=11580343;break;case"aluminum":t=2700,updateMatt(!0,13686231,object.type),object.color=13686231;break;case"PE":t=950,updateMatt(!0,15658734,object.type),object.color=15658734;break;case"ABS":t=1100,updateMatt(!0,3329330,object.type),object.color=3329330}object.density=t,calculateMass(t,object.type)}function calculateMass(e,t){let r=getSubmergedVolume(t,1)[0];measurments.volumeObj=Math.round(1e6*r),volumeObj.textContent="V = "+measurments.volumeObj+"ml";let o=r*e;object.mass=o,measurments.mass=o,measurments.density=e}function updateMatt(t,r,o){let i;if(!1==t){let a=new e.TextureLoader().load("textures/"+r+".jpg");i=new e.MeshPhongMaterial({map:a})}else i=new e.MeshPhongMaterial({color:r});sphere.material.dispose(),sphere.material=i,cube.material.dispose(),cube.material=i,cyl.material.dispose(),cyl.material=i,cone.material.dispose(),cone.material=i}initialiseScene();let geometry=new e.BoxGeometry(object.radius,object.c,object.radius),material=new e.MeshPhongMaterial({color:16711680}),cube=new e.Mesh(geometry,material),geometry2=new e.SphereGeometry(object.radius,32,16),material2=new e.MeshPhongMaterial({color:16711680}),sphere=new e.Mesh(geometry2,material2),geometryCyl=new e.CylinderGeometry(object.radius,object.radius,object.c,32,1),materialCyl=new e.MeshPhongMaterial({color:16711680}),cyl=new e.Mesh(geometryCyl,materialCyl),geometryCone=new e.ConeGeometry(object.radius,object.c,32),materialCone=new e.MeshPhongMaterial({color:16711680}),cone=new e.Mesh(geometryCone,materialCone),geometryCylinder=new e.CylinderGeometry(beaker.radius,beaker.radius,beaker.mixedHeight,32,1),cylinderMats=[new e.MeshBasicMaterial({color:5592575,transparent:!0}),new e.MeshBasicMaterial({color:7829503,transparent:!0,side:e.DoubleSide}),new e.MeshBasicMaterial({color:5592575,transparent:!0,side:e.DoubleSide})],cylinder=new e.Mesh(geometryCylinder,cylinderMats);scene.add(cylinder),cyl.position.x=object.xPos,cyl.position.y=object.height,cube.position.x=object.xPos,cube.position.y=object.height,cube.rotation.y=Math.PI/4,cone.position.x=object.xPos,cone.position.y=object.height,cylinder.position.y=beaker.yPos+beaker.mixedHeight/2,sphere.position.y=.6,cylinder.position.x=object.xPos,sphere.position.x=object.xPos,cylinder.material[0].opacity=.45,cylinder.material[1].opacity=.45,cylinder.material[2].opacity=.45;let geometryCircle=new e.CircleGeometry(beaker.radius,32),materialCircle=new e.MeshBasicMaterial({color:7829503,transparent:!0}),circle=new e.Mesh(geometryCircle,materialCircle);circle.position.x=object.xPos,circle.position.y=beaker.yPos+beaker.mixedHeight,circle.rotation.x=4.72,circle.material.opacity=.5;let curve=new e.QuadraticBezierCurve3(new e.Vector3(0,.3,0),new e.Vector3(0,.1,0),new e.Vector3(0,0,0)),points=curve.getPoints(50),geometryRope=new e.BufferGeometry().setFromPoints(points),materialRope=new e.LineBasicMaterial({color:0,linewidth:1}),rope=new e.Line(geometryRope,materialRope);function updateRope(e,t,r){r[0].lx=r[0].x,r[0].x=object.xPos,r[0].ly=r[0].y,r[0].y=t,r[0].lz=r[0].z,r[0].z=0,rope.geometry.attributes.position.setXYZ(0,object.xPos,t,0),r[100].lx=r[100].x,r[100].x=object.xPos,r[100].ly=r[100].y,r[100].y=e,r[100].lz=r[100].z,r[100].z=0,rope.geometry.attributes.position.setXYZ(100,object.xPos,e,0);for(let o=1;o<100;o++){let i=r[o].x+(r[o].x-r[o].lx)*.8,a=r[o].y+(r[o].y-r[o].ly)*.8+-.1,c=r[o].z+(r[o].z-r[o].lz)*.8,n=distanceBetweenPoints(i,a,c,r[o-1].x,r[o-1].y,r[o-1].z),s=(.003-n)/n/2;i+=(i-r[o-1].x)*s*2,a+=(a-r[o-1].y)*s*2,c+=(c-r[o-1].z)*s*2,rope.geometry.attributes.position.setXYZ(o,i,a,c);let $=distanceBetweenPoints(i,a,c,object.xPos,object.height,0);$<object.radius&&(object.radius,i+=Math.sqrt(object.radius*object.radius-$*$)),r[o].lx=r[o].x,r[o].x=i,r[o].ly=r[o].y,r[o].y=a,r[o].lz=r[o].z,r[o].z=c}rope.geometry.attributes.position.needsUpdate=!0}function distanceBetweenPoints(e,t,r,o,i,a){return Math.sqrt((e-o)*(e-o)+(t-i)*(t-i)+(r-a)*(r-a))}function createRope(t,r){let o=[],i=[],a=t/r;for(let c=0;c<=r;c++){let n={x:object.xPos+.2,y:c*a,z:0,lx:object.xPos+.2,ly:c*a,lz:0};o.push(new e.Vector3(n.x,n.y,0)),i.push(n)}let s=new e.BufferGeometry().setFromPoints(o),$=new e.LineBasicMaterial({color:0}),l=new e.Line(s,$);return[l,i]}rope.position.x=object.xPos,scene.add(rope),rope.rotation.y=-2.2;let canvasBeaker=document.createElement("canvas"),ctx=canvasBeaker.getContext("2d"),textureBeaker;function drawBeakerLines(){canvasBeaker.style="font-smooth: never; -webkit-font-smoothing : none;",canvasBeaker.width=2e3*Math.PI*beaker.radius,canvasBeaker.height=1e3*beaker.height,ctx.clearRect(0,0,canvasBeaker.width,canvasBeaker.height),ctx.fillStyle="rgba(224, 242, 241, 0.2)",ctx.fillRect(0,0,canvasBeaker.width,canvasBeaker.height),ctx.strokeStyle="black",ctx.fillStyle="black",ctx.font="10px Arial";let e=beaker.height*beaker.radius*beaker.radius*Math.PI*1e6,t=e/(canvasBeaker.height/3);t=t<1.5?1:t<3.5?2:t<8?5:t<15?10:t<35?20:t<80?50:100,beaker.accuracy=t/2;let r=5*t,o=Math.floor(e/t)*t-5*t;for(let i=r;i<=o;i+=t)n(s(i),5);for(let a=r;a<=o;a+=5*t)n(s(a),10);r=10*t;for(let c=r;c<=o;c+=10*t)ctx.fillText(c.toString(),10,s(c)+3);function n(e,t){ctx.beginPath(),ctx.moveTo(0,e),ctx.lineTo(t,e),ctx.stroke()}function s(e){return canvasBeaker.height-e/(Math.PI*beaker.radius*beaker.radius*1e3)}}function drawForceMeter(){let t=new e.CanvasTexture(forceMeter.canvasTube),r=new e.CylinderGeometry(.007,.007,.1,32,1),o=new e.MeshBasicMaterial({map:t,transparent:!0});forceMeter.tube=new e.Mesh(r,o),scene.add(forceMeter.tube),forceMeter.tube.position.x=object.xPos,forceMeter.tube.position.y=object.height+.3,forceMeter.tube.renderOrder=1,forceMeter.canvasTube.width=2e3*Math.PI*.007,forceMeter.canvasTube.height=100,forceMeter.ctxTube.fillStyle="rgba(200, 200, 200, 0.5)",forceMeter.ctxTube.fillRect(0,0,forceMeter.canvasTube.width,forceMeter.canvasTube.height);for(let i=forceMeter.canvasTube.height/2;i<forceMeter.canvasTube.height;i+=3)forceMeter.ctxTube.beginPath(),forceMeter.ctxTube.moveTo(forceMeter.canvasTube.width-1,i),forceMeter.ctxTube.lineTo(forceMeter.canvasTube.width-7,i),forceMeter.ctxTube.stroke();forceMeter.textureSpring=new e.CanvasTexture(forceMeter.canvasSpring);let a=new e.CylinderGeometry(.006,.006,.05,32,1,!0),c=new e.MeshBasicMaterial({map:forceMeter.textureSpring,transparent:!0});forceMeter.spring=new e.Mesh(a,c),scene.add(forceMeter.spring),forceMeter.spring.position.x=object.xPos,forceMeter.spring.material.side=e.DoubleSide,forceMeter.canvasSpring.width=2e3*Math.PI*.006,forceMeter.canvasSpring.height=50;let n=forceMeter.canvasSpring.height/10;for(let s=0;s<10;s++)forceMeter.springCtx.beginPath(),forceMeter.springCtx.moveTo(0,s*n),forceMeter.springCtx.lineTo(forceMeter.canvasSpring.width,(s+1)*n),forceMeter.springCtx.stroke();let $=new e.CylinderGeometry(.007-5e-4,.007-5e-4,.002,32,1),l=new e.MeshBasicMaterial({color:800080});forceMeter.indicator=new e.Mesh($,l),scene.add(forceMeter.indicator),forceMeter.indicator.position.x=object.xPos;let d=new e.CylinderGeometry(.007-5e-4,.007-5e-4,.002,32,1);forceMeter.tubeTap=new e.Mesh(d,l),scene.add(forceMeter.tubeTap),forceMeter.tubeTap.position.x=object.xPos;let u=new e.CylinderGeometry(.002,.002,.053,32,1);forceMeter.rod=new e.Mesh(u,l),scene.add(forceMeter.rod),forceMeter.rod.position.x=object.xPos}drawBeakerLines(),drawForceMeter();let beakerMesh={bot:0,top:0,in:0,out:0};function drawBeaker(){let t=new e.CylinderGeometry(beaker.radius+.005,beaker.radius+.005,.005,32,1),r=new e.MeshBasicMaterial({color:14742257,transparent:!0});beakerMesh.bot=new e.Mesh(t,r),beakerMesh.bot.position.x=object.xPos,beakerMesh.bot.position.y=beaker.yPos,beakerMesh.bot.material.opacity=.2,textureBeaker=new e.CanvasTexture(canvasBeaker);let o=new e.CylinderGeometry(beaker.radius+.005,beaker.radius+.005,beaker.height,32,1,!0),i=new e.MeshBasicMaterial({map:textureBeaker,transparent:!0});beakerMesh.out=new e.Mesh(o,i),beakerMesh.out.position.x=object.xPos,beakerMesh.out.position.y=beaker.yPos+beaker.height/2,beakerMesh.out.rotation.y=.2,beakerMesh.out.renderOrder=2,beakerMesh.out.material.side=e.DoubleSide;let a=new e.CylinderGeometry(beaker.radius+.001,beaker.radius+.001,beaker.height,32,1,!0);beakerMesh.in=new e.Mesh(a,r),beakerMesh.in.position.x=object.xPos,beakerMesh.in.position.y=beaker.yPos+beaker.height/2,beakerMesh.in.material.opacity=.2,beakerMesh.in.renderOrder=2;let c=new e.RingGeometry(beaker.radius+.001,beaker.radius+.005,32);beakerMesh.top=new e.Mesh(c,r),beakerMesh.top.position.x=object.xPos,beakerMesh.top.position.y=beaker.yPos+beaker.height,beakerMesh.top.rotation.x=4.72,scene.add(beakerMesh.bot),scene.add(beakerMesh.out),scene.add(beakerMesh.in),scene.add(beakerMesh.top)}function redrawBeaker(t,r){beakerMesh.bot.geometry.dispose(),beakerMesh.bot.geometry=new e.CylinderGeometry(t+.005,t+.005,.005,32,1),beakerMesh.out.geometry.dispose(),beakerMesh.out.geometry=new e.CylinderGeometry(t+.005,t+.005,r,32,1,!0),beakerMesh.out.position.y=beaker.yPos+r/2,beakerMesh.in.geometry.dispose(),beakerMesh.in.geometry=new e.CylinderGeometry(t+.001,t+.001,r,32,1,!0),beakerMesh.in.position.y=beaker.yPos+r/2,beakerMesh.top.geometry.dispose(),beakerMesh.top.geometry=new e.RingGeometry(t+.001,t+.005,32),beakerMesh.top.position.y=beaker.yPos+beaker.height,drawBeakerLines(),textureBeaker.dispose(),textureBeaker=new e.CanvasTexture(canvasBeaker),beakerMesh.out.material.map=textureBeaker,t>.069&&(object.xPos=.52+t-.07,beaker.xPos=object.xPos,cylinder.position.x=beaker.xPos,beakerMesh.bot.position.x=beaker.xPos,beakerMesh.out.position.x=beaker.xPos,beakerMesh.in.position.x=beaker.xPos,beakerMesh.top.position.x=beaker.xPos,sphere.position.x=object.xPos,cyl.position.x=object.xPos,cube.position.x=object.xPos,cone.position.x=object.xPos,rope.position.x=object.xPos,forceMeter.tube.position.x=object.xPos,forceMeter.spring.position.x=object.xPos,forceMeter.indicator.position.x=object.xPos,forceMeter.tubeTap.position.x=object.xPos,forceMeter.rod.position.x=object.xPos,holder.geometry.dispose(),holder.position.x=ruler.position.x+(object.xPos-ruler.position.x)/2,holder.geometry=new e.BoxGeometry(object.xPos-ruler.position.x+.02,.01,.015));let o=2.917*r+.0083;o=o>.65?.65:o,beaker.waterHeight=r*o,beaker.mixedHeight=beaker.waterHeight,t>.069?changeRadius.setAttribute("max",500):changeRadius.setAttribute("max",Math.round(140*t)/2*100),beakerVolume.textContent=Number((r*t*t*Math.PI*1e3).toPrecision(2)).toLocaleString()+"L \xb1 "+Number(beaker.accuracy.toPrecision(2)).toLocaleString()+"ml",changeRadius.dispatchEvent(new Event("input"))}function getVolume(t){let r=t.attributes.position,o=r.count/3,i=0,a=new e.Vector3,c=new e.Vector3,n=new e.Vector3;for(let s=0;s<o;s++)a.fromBufferAttribute(r,3*s+0),c.fromBufferAttribute(r,3*s+1),n.fromBufferAttribute(r,3*s+2),i+=signedVolumeOfTriangle(a,c,n);return i}function signedVolumeOfTriangle(e,t,r){return e.dot(t.cross(r))/6}function placeForceMeter(t){holder.position.y=forceMeter.height+.1,forceMeter.tube.position.y=forceMeter.height+.05,forceMeter.indicator.position.y=forceMeter.height+.05,forceMeter.tubeTap.position.y=forceMeter.height-.003,forceMeter.rod.position.y=forceMeter.height+.0235,forceMeter.displacement=-t,forceMeter.displacement=forceMeter.displacement<-.05?-.05:forceMeter.displacement,forceMeter.indicator.position.y+=forceMeter.displacement,forceMeter.rod.position.y+=forceMeter.displacement,forceMeter.spring.geometry.dispose(),forceMeter.spring.geometry=new e.CylinderGeometry(.006,.006,.05-forceMeter.displacement,32,1,!0),forceMeter.spring.position.y=forceMeter.height+.05+(.05+forceMeter.displacement)/2,forceMeter.springCtx.clearRect(0,0,forceMeter.canvasSpring.width,forceMeter.canvasSpring.height),forceMeter.canvasSpring.height=1e3*(.05-forceMeter.displacement);let r=forceMeter.canvasSpring.height/10;for(let o=0;o<10;o++)forceMeter.springCtx.beginPath(),forceMeter.springCtx.moveTo(0,o*r),forceMeter.springCtx.lineTo(forceMeter.canvasSpring.width,(o+1)*r),forceMeter.springCtx.stroke();forceMeter.textureSpring.dispose(),forceMeter.textureSpring=new e.CanvasTexture(forceMeter.canvasSpring),forceMeter.spring.material.map=forceMeter.textureSpring;let i=forceMeter.height+.04,a=-forceMeter.displacement/.05*forceMeter.maxForce,c=forceMeter.maxForce/100;a>c&&a<forceMeter.maxForce-c&&(a+=forceMeter.randomFactor*c),a=Math.round(a/c)*c,forceText.style.top=100-100*i+"%";let n=2;switch(forceMeter.maxForce){case 1:case 5:n=2;break;case 10:case 50:n=1;break;case 100:n=0}forceText.textContent="F:"+a.toFixed(n).replace(".",",")+" N",measurments.force=parseFloat(a.toFixed(n))}function updateForcemeterRandom(){forceMeter.randomFactor=2*Math.random()-1}function placeRope(t,r,o){rope.position.y=t;let i=[];if("sphere"==o){let a=(.3-r+t)/.3,c=new e.CatmullRomCurve3([new e.Vector3(0,r-t,0),new e.Vector3(0,r-t-.01,0),new e.Vector3(1/(1+Math.exp(5-50*a))*.01,-(.15*a)+.06,0),new e.Vector3(1/(1+Math.exp(5-50*a))*.01,-(.15*a)+.03,0),new e.Vector3(0,.005,0),new e.Vector3(0,0,0)]);c.tension=.001,i=c.getPoints(100);let n,s=0;for(let $=1;$<100;$++){let l=distanceBetweenPoints(i[$].x+object.xPos,i[$].y+t,i[$].z,object.xPos,object.height-object.radius,0);l<object.radius&&(i[$].x>0?i[$].x+=Math.sqrt(object.radius*object.radius-l*l):i[$].x-=Math.sqrt(object.radius*object.radius-l*l)),Math.abs(i[$].x)>s&&(s=i[$].x,n=i[$].y),i[$].y<=i[$-1].y&&i[$].y<n?i[$].x=i[$-1].x:i[$].y>=i[$-1].y&&n>i[$].y&&(i[$].x=s-.003)}}else if("cylinder"==o){let d=Math.floor((.3-(r-t))/.003),u=0,b=0,h=0;for(;u<d;u++).003*u/2<object.radius&&(i.push(new e.Vector3(.003*u/2,.001,0)),b++);let p=u-b;if(u=b,Math.ceil(p/=2.2)>1){let m=0;for(;m<p;m++)i.push(new e.Vector3(object.radius+.001,-(.003*(m+1)),0)),u++;for(;m<2*p;m++){h=p/200;let y=(object.radius+.001)*Math.cos(h),g=(object.radius+.001)*Math.sin(h);i.push(new e.Vector3(y,-(.003*(2*p-m-1)),g)),u++}}if(u<2)for(;u<100;u++)i.push(new e.Vector3(0,.003*u,0));let x=u,f=i[x-1].x,j=100-x;for(;u<100;u++){let _=(r-t)/f/f,M=f/j*(u-x)*Math.cos(h),k=_*(M*M),v=f/j*(u-x)*Math.sin(h);i.push(new e.Vector3(-M+i[x-1].x,k+.001,-v+i[x-1].z))}}else if("cube"==o){let w=Math.floor((.3-(r-t))/.003),B=0,P=0,S=0;for(;B<w;B++).003*B/2<.5*object.radius&&(i.push(new e.Vector3(.003*B/2,.001,0)),P++);let C=B-P;if(B=P,Math.ceil(C/=2.2)>1){let F=0;for(;F<C;F++)i.push(new e.Vector3(.5*object.radius+.001,-(.003*(F+1)),0)),B++;for(;F<2*C;F++){S=C/200;let T=(.5*object.radius+.001)*Math.cos(S),R=(.5*object.radius+.001)*Math.sin(S);i.push(new e.Vector3(T,-(.003*(2*C-F-1)),R)),B++}}if(B<2)for(;B<100;B++)i.push(new e.Vector3(0,.003*B,0));let E=B,I=i[E-1].x,H=100-E;for(;B<100;B++){let L=(r-t)/I/I,V=I/H*(B-E)*Math.cos(S),z=L*(V*V),G=I/H*(B-E)*Math.sin(S);i.push(new e.Vector3(-V+i[E-1].x,z+.001,-G+i[E-1].z))}}else if("cone"==o){let O=Math.floor((.3-(r-t))/.003),A=0,q=0,D=0;for(;A<O;A++).003*A/2<.01*object.radius&&(i.push(new e.Vector3(.003*A/2,.001,0)),q++);let N=A-q;if(A=q,Math.ceil(N/=2.2)>1){let W=Math.sqrt(object.c*object.c+object.radius*object.radius)/object.c,X=0;for(;X<N;X++){let Y=-(.003*(X+1))/W,Z=-Y/object.c*object.radius;Z>object.radius&&(Z=object.radius);let U=Z;i.push(new e.Vector3(U+.001,Y,0)),A++}for(;X<2*N;X++){let Q=-(.003*(2*N-X-1))/W,J=-Q/object.c*object.radius;J>object.radius&&(J=object.radius);let K=J*Math.cos(D=N/200),ee=J*Math.sin(D);i.push(new e.Vector3(K,Q,ee)),A++}}if(A<2)for(;A<100;A++)i.push(new e.Vector3(0,.003*A,0));let et=A,er=i[et-1].x+1e-5,eo=100-et;for(;A<100;A++){let ei=(r-t)/er/er,ea=er/eo*(A-et)*Math.cos(D),ec=ei*(ea*ea),en=er/eo*(A-et)*Math.sin(D);i.push(new e.Vector3(-ea+i[et-1].x,ec+.001,-en+i[et-1].z))}}rope.geometry.dispose(),rope.geometry=new e.BufferGeometry().setFromPoints(i)}function calculateRopePosition(e,t,r){let o;if("sphere"==r);else if(r==cylinder)return 0;return o}function getSubmergedVolumeAdv(e,t){let r=new Evaluator,o=new Brush(e.geometry);o.position.y=e.position.y;let i=new Brush(t.geometry);return i.position.y=t.position.y,o.updateMatrixWorld(),i.updateMatrixWorld(),computeMeshVolume(r.evaluate(o,i,INTERSECTION))}function getSubmergedVolume(e,t){if("sphere"==e){let r=t-(object.height-2*object.radius);if(r<=0)return[0,0];if(!(r<2*object.radius))return[4/3*Math.PI*object.radius*object.radius*object.radius,0];{let o=2*Math.PI*Math.sqrt(2*object.radius*r-r*r);return[Math.PI*r*r/3*(3*object.radius-r),o]}}if("cylinder"==e){let i=t-(object.height-object.c);if(i<=0)return[0,0];if(!(i<object.c))return[Math.PI*object.radius*object.radius*object.c,0];{let a=2*Math.PI*object.radius;return[Math.PI*object.radius*object.radius*i,a]}}if("cube"==e){let c=t-(object.height-object.c);if(c<=0)return[0,0];if(!(c<object.c))return[object.radius*object.radius*object.c,0];{let n=4*object.radius;return[object.radius*object.radius*c,n]}}if("cone"==e){let s=t-(object.height-object.c);if(s<=0)return[0,0];if(!(s<object.c))return[1/3*Math.PI*object.radius*object.radius*object.c,0];{let $=1/3*Math.PI*object.radius*object.radius*object.c,l=object.c-s,d=object.radius*l/object.c,u=1/3*Math.PI*d*d*l,b=2*Math.PI*Math.sqrt(3*u/Math.PI/(object.c-s));return[$-u,b]}}}function initialiseMeshObject(e){"sphere"==e?scene.add(sphere):"cylinder"==e?scene.add(cyl):"cube"==e?scene.add(cube):"cone"==e&&scene.add(cone);"density"==document.querySelector('input[type=radio][name="tgmass"]:checked').value?"pine"==object.mat||"walnut"==object.mat?updateMatt(!1,object.mat):updateMatt(!0,object.color):updateMatt(!0,16711680)}function removeObject(e){"sphere"==e?scene.remove(sphere):"cylinder"==e?scene.remove(cyl):"cube"==e?scene.remove(cube):"cone"==e&&scene.remove(cone)}function updateObjectMesh(t){"sphere"==t?sphere.scale.setScalar(object.radius/.04):"cylinder"==t?(cyl.geometry.dispose(),cyl.geometry=new e.CylinderGeometry(object.radius,object.radius,object.c,32,1)):"cube"==t?(cube.geometry.dispose(),cube.geometry=new e.BoxGeometry(object.radius,object.c,object.radius)):"cone"==t&&(cone.geometry.dispose(),cone.geometry=new e.ConeGeometry(object.radius,object.c,32))}function updateObjectPosition(e,t){let r=t-beaker.yPos;"sphere"==e?(sphere.position.y=t-object.radius,r-=2*object.radius):"cylinder"==e?(cyl.position.y=t-object.c/2,r-=object.c):"cube"==e?(cube.position.y=t-object.c/2,r-=object.c):"cone"==e&&(cone.position.y=t-object.c/2,r-=object.c),heightText.textContent=(Math.round(200*r)/2).toFixed(1).replace(".",",")+" cm",measurments.height=Math.round(200*r)/2}drawBeaker(),initialiseMeshObject(object.type);let timePrev=0;function render(t){let r=t-timePrev;timePrev=t,calculateNewPosition(r,object.type),updateObjectPosition(object.type,object.height),cylinder.geometry.dispose(),cylinder.geometry=new e.CylinderGeometry(beaker.radius,beaker.radius,beaker.mixedHeight,32,1),cylinder.position.y=beaker.yPos+beaker.mixedHeight/2,volumeText.style.bottom=(beaker.yPos+beaker.mixedHeight-.03)*100+"%",volumeText.style.left=(object.xPos-beaker.radius-.105)*300/4+"%",measurments.volume=Math.round(beaker.mixedHeight*Math.PI*beaker.radius*beaker.radius/beaker.accuracy*1e6)*beaker.accuracy,volumeText.textContent=measurments.volume.toPrecision(4)+"ml ►",ui.upBtn?forceMeter.height<.8&&(updateForcemeterRandom(),forceMeter.height+=.002/16.7*r):ui.downBtn&&forceMeter.height>.4&&(updateForcemeterRandom(),forceMeter.height-=.002/16.7*r),renderer.render(scene,camera),requestAnimationFrame(render)}requestAnimationFrame(render),resizeCanvas();export{xyValues,measurments};