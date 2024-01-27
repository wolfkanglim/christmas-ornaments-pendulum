import * as THREE from './js/three.module.js';
import { OrbitControls } from './js/OrbitControls.js';
import {stopWatch} from './library/stopWatch.js';
import {createPendulum} from './library/ornament.js';
import {playPiano, playBellMajor,  playBellC} from './library/instruments.js';

const map = (value, sMin, sMax, dMin, dMax) => {
     return dMin + ((value - sMin) / (sMax - sMin)) * (dMax - dMin);
   };
   const range = (n, m = 0) =>
     Array(n)
       .fill(m)
       .map((i, j) => i + j);
   
   // https://github.com/bit101/CodingMath
   const bez = (p0, p1, p2, t) => {
     const x = Math.pow(1 - t, 2) * p0.x + (1 - t) * 2 * t * p1.x + t * t * p2.x;
     const y = Math.pow(1 - t, 2) * p0.y + (1 - t) * 2 * t * p1.y + t * t * p2.y;
     return [x, y];
   };
   const rad = (deg) => (deg / 180) * Math.PI;
   
   const rand = (max, min = 0) => min + Math.random() * (max - min);
   const randInt = (max, min = 0) => Math.floor(min + Math.random() * (max - min));
   const randChoise = (arr) => arr[randInt(arr.length)];
   

const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//toggle  to sound on/off
const toggles = {
     sound: document.getElementById('sound-toggle'),
}

let soundEnabled = false;
let pulseEnabled = true;

const handleSoundToggle = (enabled = !soundEnabled ) => {
     soundEnabled = enabled;
     toggles.sound.dataset.toggled = enabled;
}

document.onvisibilitychange = () => {
     handleSoundToggle(false);
}



/////variables////////////////////////////

let scene, camera, renderer, orbitControls;
let cameraFront, cameraTop, insetWidth, insetHeight;
let stars;
const textureLoader = new THREE.TextureLoader();
const metalTextureColor = textureLoader.load('./assets/textures/Metal043A_1K_Color.jpg');
const snowflakeTexture = textureLoader.load('./assets/images/snowflake.png');
const textures = [];
for(let i = 0; i < 24; i++){
     let texture = textureLoader.load(`./assets/textures/xmas-textures/christmas-${i + 1}.jpg`);
     textures.push(texture);
}

let torusRadius, tubeRadius;
const groupRight = new THREE.Object3D();
const groupLeft = new THREE.Object3D();
const groupTube = new THREE.Object3D();
let spinningRing, spinningRing2;
let spinningGroup = new THREE.Group();

let rightCubes = [];
let leftCubes = [];
let vibraphoneTube = [];

const maxPendulum = 30;
let ballRadius = 10;
let stringLength = 10;
const pendulums1 = [];
const pendulums2 = [];
let startTime = null;

///// Color 18
const colors = []; 
for(let i = 0; i < 28; i++){
     let color = Math.floor(Math.random() * 0xffffff);
     colors.push(color);
}


// Functions //
initThree();
createLights();
createStars();
createVibraphone();
createVibraphoneTube();
cameraMove();
frontCameraMove();
createSpinningRing();
stopWatch();

[
   
     [6, 8],
     [4, 8],
     [2, 8],
     [0, 8],
     [-2, 8],
   
 
   ].forEach(([row, num]) => {
     addTube(row);
     //addOrnaments(num, row * 12);
   });

 
document.onclick = () => {
     handleSoundToggle();
     animate();
}   
///// THREE /////

function initThree(){
     scene = new THREE.Scene();
     //scene.background = new THREE.Color(0x111111);
     scene.background = textures[7];
     scene.fog = new THREE.Fog(0x555555, 500, 2580);

     camera = new THREE.PerspectiveCamera(
          65,
          window.innerWidth/window.innerHeight,
          0.1,
          10000
     )
     camera.position.set(0, 40, 240);
     camera.lookAt(0, 0, 0);

     ///// camera front
     insetWidth = window.innerHeight * 0.35;
     insetHeight = window.innerHeight * 0.3;
     
     cameraFront = new THREE.PerspectiveCamera( 60, insetWidth / insetHeight,
     1, 500)
     cameraFront.position.set(0, 0, 75);
     cameraFront.lookAt(0, 15, 0);
     cameraFront.name = 'frontCamera';

     // camera top //
     cameraTop = new THREE.PerspectiveCamera(70, insetWidth/insetHeight, 1, 500);
     cameraTop.position.set(-40, 100, 70);
     cameraTop.lookAt(0, 0, 0);
     cameraTop.name = 'cameraTop';

     renderer = new THREE.WebGLRenderer({antialias: true, 
     canvas: canvas});
     renderer.setPixelRatio(window.devicePixelRatio);
     renderer.setSize(window.innerWidth, window.innerHeight);
     //document.body.appendChild(renderer.domElement);
     renderer.shadowMap.enabled = true;

      orbitControls = new OrbitControls(camera, renderer.domElement);
     orbitControls.enableDamping = true;
     orbitControls.dampingFactor = 0.1; 

   
     const axesHelper = new THREE.AxesHelper(5);
     //scene.add(axesHelper);
     scene.position.y = 50;
}

//camera controls
function cameraMove(){
     let tl = gsap.timeline({repeat: 2, repeatDelay: 30, onComplete: cameraFadeout,});
     tl.to(camera.position, {z: 50, duration:30});
     tl.to(camera.position, {z: 450, duration:45});
     tl.to(camera.position, {x: -140, duration: 30});
     tl.to(camera.position, {y:0, duration: 15});
     tl.to(camera.position, {x: 100, duration:30});
     tl.to(camera.position, {x: 0, duration:15});
     tl.to(camera.position, {y: 250 , duration: 15});
     tl.to(camera.position, {y: -50 , duration: 15});
     tl.to(camera.position, {z: 350, duration:30}); 
     tl.to(camera.position, {y: 128 , duration: 30});
     tl.to(camera.position, {x: -150, duration:30}); 
     tl.to(camera.position, {z:  450, duration:30}); 
     tl.to(camera.position, {x: 100, duration:30});  
     tl.to(camera.position, {z: 250, duration:30});  
     tl.to(camera.position, {y: 180, duration:15});  
     tl.to(camera.position, {x: 0, duration:15});  
     tl.to(camera.position, {y: 40, duration:15});  
     tl.to(camera.position, {z: 450, duration:30});
     // 240s + 30
}
function cameraFadeout(){
     let tl = gsap.timeline();
     tl.to(camera.position, {z: 2490, duration: 30});
}

function frontCameraMove(){
     let tl = gsap.timeline({repeat: 14, repeatDelay: 4});
     tl.to(cameraFront.position, {z: 25, duration:24});
     tl.to(cameraFront.position, {y: 30, duration: 8});
     tl.to(cameraFront.position, {z: 15, duration:8});
     tl.to(cameraFront.position, {x: -30, duration: 8});
     tl.to(cameraFront.position, {x: 38, duration:12});
     tl.to(cameraFront.position, {x: 1, duration:8});
     tl.to(cameraFront.position, {y: 0 , duration: 6});
     tl.to(cameraFront.position, {y: 20 , duration: 24});
     tl.to(cameraFront.position, {z: 38, duration:6}); 
     tl.to(cameraFront.position, {x: 20, duration:6}); 
     tl.to(cameraFront.position, {z:  10, duration:12}); 
     tl.to(cameraFront.position, {x: 15, duration:8});  
     tl.to(cameraFront.position, {z: 50, duration:12});  
     tl.to(cameraFront.position, {y: 20, duration:12});  
     tl.to(cameraFront.position, {x: 0, duration:8});  
     tl.to(cameraFront.position, {y: 0, duration:12});  
     tl.to(cameraFront.position, {z: 75, duration:12});
}

function createLights(){
     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
     scene.add(ambientLight);
     const dirLight = new THREE.DirectionalLight(0xffffff, 0.51);
     dirLight.position.set(5, 550, 250);
     scene.add(dirLight);
     dirLight.castShadow = true;
     dirLight.shadow.mapSize.width = 1024;
     dirLight.shadow.mapSize.height = 1024;
     const d = 150;
     dirLight.shadow.camera.top = d;
     dirLight.shadow.camera.right = d;
     dirLight.shadow.camera.bottom = -d;
     dirLight.shadow.camera.left = -d;
     dirLight.shadow.camera.near = 0.1;
     dirLight.shadow.camera.far = 100;

     const pointLight = new THREE.PointLight(0xffffff, 0.58);
     pointLight.position.set(0, 250, 250);
     scene.add(pointLight);

     const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
     pointLight2.position.set(0, -250, 250);
     scene.add(pointLight2);

     const greenLight = new THREE.PointLight(0x00ff00, 0.5, 1000, 0);
     greenLight.position.set(550, 50, 0);
     scene.add(greenLight);

     const redLight = new THREE.PointLight(0xff0000, 0.5, 1000, 0);
     redLight.position.set(-550, 50, 0);
     scene.add(redLight);

     const blueLight = new THREE.PointLight(0x0000ff, 0.5, 1000, 0);
     greenLight.position.set(0, 50, 550);
     scene.add(blueLight);
};

function createStars(){
     let geo = new THREE.BufferGeometry();
     let positions = [];
     for(let i = 0; i < 1000; i++){
          positions.push(Math.random() * 2000 - 1000); 
          positions.push(Math.random() * 2000 - 1000); 
          positions.push(Math.random() * 1500 - 1550); 
     }
     let mat = new THREE.PointsMaterial({
          color: 0xffffff,
          map: snowflakeTexture,
          size: 5,
          sizeAttenuation: true,

     });
     geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

     stars = new THREE.Points(geo, mat);
     scene.add(stars);
};

function createTorus(){
     const geometry = new THREE.TorusGeometry(torusRadius, tubeRadius, 24, 48);
     const material = new THREE.MeshPhongMaterial({
          //color:  new THREE.Color(),
          map: metalTextureColor,
          transparent: true,
          opacity: 0.5,
     })
    
     const torusMesh = new THREE.Mesh(geometry, material);
     torusMesh.castShadow = true;
     torusMesh.receiveShadow = true;
     scene.add(torusMesh);
     return torusMesh;
};
///// Vibraphone Tube /////
function createVibraphoneTube(){
     for(let i = 0; i < 28; i++){
          const tube = createTorus(torusRadius, tubeRadius, 24, 48);
            
          tube.material.color = new THREE.Color(colors[i]);
         
          torusRadius = 2 + ( 4 * i);          tubeRadius = (i * 0.05 + ballRadius * 0.25);
          tube.position.set( 0, 120 -  16 * i,  0);
          tube.rotation.x = -Math.PI * 0.5;
          vibraphoneTube.push(tube);
          groupTube.add(tube);
          groupTube.position.set(420, 0, 0);
     }
     scene.add(groupTube);
};

function createCubeMesh(){
     const geometry = new THREE.BoxGeometry();
     const material = new THREE.MeshPhongMaterial({
          transparent: true,
          opacity:0.075
     })
     const cubeMesh = new THREE.Mesh(geometry, material);
     cubeMesh.castShadow = true;
     cubeMesh.receiveShadow = true;
     scene.add(cubeMesh);
     return cubeMesh;
}

function createVibraphone(){
     for(let i = 0; i < maxPendulum; i++){
          const cube = createCubeMesh();
          let scaleX = 1.5 * (i * 0.2 + ballRadius * 0.5);
          let posX = 2* i + 4 + (0.2 * i + 2) * i; 
         
          cube.material.color = new THREE.Color(colors[i]);

          cube.scale.set(scaleX + 1.5, i * 1+ 2, scaleX * 0.5);
          cube.position.set(posX, 34 + (i * 0.5)/1 + 0.5, 0);
          rightCubes.push(cube);
          groupRight.add(cube);  
         
          const cubeL = createCubeMesh();
          cubeL.material.color = new THREE.Color(colors[i]);
          cubeL.scale.set(scaleX + 1.5, i * 1+ 2, scaleX/2);
          cubeL.position.set(-posX, 34 + (i * 0.5) / 1 + 0.5, 0);
          leftCubes.push(cubeL);
          groupLeft.add(cubeL);  
     } 
     scene.add(groupRight);
     scene.add(groupLeft);
};

function createSpinningRing(){
     const ringGeo = new THREE.TorusGeometry(5, 0.5, 16, 32, Math.PI * 2);
     const ringMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: metalTextureColor,
          roughness: 1,
          //roughnessMap: ballTextureRoughness,
          metalness: 0.5,
          transparent: true,
          opacity: 0.8
     })
     spinningRing = new THREE.Mesh(ringGeo, ringMat);
     spinningRing.rotation.x = -Math.PI / 2 + 0.2;
     spinningRing.position.y = 12;
     spinningRing.castShadow = true;
     spinningRing.receiveShadow = true;
     spinningRing2 = new THREE.Mesh(ringGeo, ringMat);
     spinningRing2.rotation.x = Math.PI / 2 ;
     spinningRing2.position.y = 10;
     spinningRing2.castShadow = true;
     spinningRing2.receiveShadow = true;
     spinningGroup.add(spinningRing, spinningRing2);
     spinningGroup.position.y = 40;
     //spinningGroup.position.y = - 1.5;
     scene.add(spinningGroup);
}
 
///// Pendulums //////////////\
let frequency = 2;
let color = new THREE.Color(0xffffff);


for(let i = 0; i < 6; i++){
     const pendulum1 = createPendulum(scene, new THREE.Vector3(i * 96 - 240, 104, 0), frequency - (i) * 0.03, Math.PI/5, stringLength * 7, ballRadius , color, textures[i + 4]);
     pendulums1.push(pendulum1);
}
for(let i = 0; i < 6; i++){
     const pendulum1 = createPendulum(scene, new THREE.Vector3(i * 96 - 240, 10, 0), frequency - (i+6) * 0.03, Math.PI/5, stringLength * 7, ballRadius + 2, color, textures[i + 7]);
     pendulums1.push(pendulum1);
}
for(let i = 0; i < 6; i++){
     const pendulum1 = createPendulum(scene, new THREE.Vector3(i * 96 - 240, -88, 0), frequency - (i+12) * 0.05, Math.PI/5, stringLength * 7, ballRadius + 4, color, textures[i + 11]);
     pendulums1.push(pendulum1);
}
for(let i = 0; i < 6; i++){
     const pendulum1 = createPendulum(scene, new THREE.Vector3(i * 96 - 240, 96 - 280, 0), frequency - (i+18) * 0.03, Math.PI/5, stringLength * 7, ballRadius + 6, color, textures[i + 16]);
     pendulums1.push(pendulum1);
}
for(let i = 0; i < 6; i++){
     const pendulum1 = createPendulum(scene, new THREE.Vector3(i * 96 - 240,  -280, 0), frequency - (i) * 0.3, Math.PI/5, stringLength * 7, ballRadius + 8, color, textures[i + 13]);
     pendulums2.push(pendulum1);
}




function animate(time){
     if(startTime == null){
          startTime = time;
     }
    
     const deltaTime = (time - startTime);
     update(deltaTime);

     renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
     renderer.render(scene, camera);
     window.requestAnimationFrame(animate);

     renderer.clearDepth();
     renderer.setScissorTest(true);
     renderer.setScissor(window.innerWidth - insetWidth - 8,  insetHeight / 4 - 16, insetWidth, insetHeight);
     renderer.setViewport(window.innerWidth - insetWidth - 8, insetHeight / 4 - 16, insetWidth, insetHeight);
     //renderer.render(scene, cameraFront);

     // top
    renderer.setScissor(8,  insetHeight / 4 - 16, insetWidth, insetHeight);
    renderer.setViewport(8,  insetHeight / 4 - 16, insetWidth, insetHeight + 16);
    //renderer.render(scene, cameraTop);      
    renderer.setScissorTest(false);
}

function update(deltaTime){
     orbitControls.update();
     stars.rotation.z += 0.001;
     spinningGroup.rotation.y += 0.05;
     pendulums1.forEach((p, index) => {          
          p.updateZ(deltaTime);
          let circleOf5th = Math.floor(index / 5);
          if(p.ball.rotation.z >= -0.001 && p.ball.rotation.z <= 0.02) {
               if(index >= 17){
                    let tl = gsap.timeline();
                    tl.to(stars.material, {size: 20, duration: 1});
                    tl.to(stars.material, {size: 5, duration: 8});
               }
               if(soundEnabled){
                    playBellMajor(index + 9);
                    //playPiano(circleOf5th);
               }
               if(pulseEnabled){                  
                    let tl = gsap.timeline({});
                    tl.to(vibraphoneTube[index].material, {opacity: 1, duration: 0.25},) ; 
                   
                    
                    tl.to([vibraphoneTube[index].material], {opacity: 0.5, duration: 2}, '<'); 
               }
              
          } 
     });  

     pendulums2.forEach((p, index) => {
          p.updateZ(deltaTime);
          if(p.ball.rotation.z >= 0.01 && p.ball.rotation.z <= 0.02) {
               if(soundEnabled){
                    //playBellC(index + 3);
               }
               if(pulseEnabled){
                    let tl = gsap.timeline({});
                    
                    tl.to([vibraphoneTube[index + 9].material], {opacity: 1, duration: 0.25}, ) ; 
                               
                  
                    tl.to([vibraphoneTube[index].material], {opacity: 0.25, duration: 2}, '<'); 
               }
              
          }  
     });     
     
};


window.addEventListener('resize', () => {
     const aspect = window.innerWidth/window.innerHeight;
     camera.aspect = aspect;
     camera.updateProjectionMatrix();
     camera.lookAt(0, 0, 0);
     renderer.setSize(window.innerWidth, window.innerHeight);

     insetWidth = window.innerHeight * 0.35;
     insetHeight = window.innerHeight * 0.35;
     cameraFront.aspect = insetWidth / insetHeight;
     cameraFront.updateProjectionMatrix();
});

function addTube(yRoot = 0) {
     class CustomSinCurve extends THREE.Curve {
       constructor(scale = 3) {
         super();
   
         this.scale = scale;
       }
   
       getPoint(t, optionalTarget = new THREE.Vector3()) {
         const x = map(t, 0, 1, 0, 10);
         const a = map(x % 2, 0, 2, 0, 1);
         const [_, y] = bez({ x: 0, y: 0 }, { x: 1, y: -0.8 }, { x: 2, y: 0 }, a);
         const z = 0;
         return optionalTarget.set(x - 5, y + yRoot, z).multiplyScalar(this.scale);
       }
     }
     
   const texture = textures[8];
     const path = new CustomSinCurve(48);
     const geometry = new THREE.TubeGeometry(path, 150, 2, 16, false);
     texture.wrapT = THREE.RepeatWrapping;
     texture.wrapS = THREE.RepeatWrapping;
     texture.repeat.x = 10;
     texture.repeat.y = 1;
     texture.offset.set(0.5, 0.5);
     const material = new THREE.MeshPhongMaterial({
       map: texture,
       shininess: 120,
     });
     const mesh = new THREE.Mesh(geometry, material);
     mesh.position.y = -150;
     scene.add(mesh);
   }
