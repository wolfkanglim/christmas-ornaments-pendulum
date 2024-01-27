///// pendulum string mesh / ball mesh
import * as THREE from '../js/three.module.js';


let stringWidth = 0.2;
let stringLength = 32;
let ballBB;
export let ballMeshes = [];
export let boxHelpers = [];
export let targets = [];

function createStringMesh(scene, length, color){
     const geometry = new THREE.CylinderGeometry(stringWidth, stringWidth, length);
     const material = new THREE.MeshPhongMaterial({
          color: color,

     })
     const string = new THREE.Mesh(geometry, material);
     string.position.set(0, 0, 0);
     string.castShadow = true;
     string.receiveShadow = true;
     scene.add(string);
     return string;
}

function createBallMesh(scene, radius, color, texture, uniforms){
     const geometry = new THREE.SphereGeometry(radius, 30);
     const material = new THREE.MeshStandardMaterial({
          color: color,
          map: texture,

     })
     material.roughness = 0.25 * Math.random() + 0.25;
     material.metalness =  0.9;
     const ball = new THREE.Mesh(geometry, material);
     //ball.castShadow = true;
     //ball.receiveShadow = true;
     scene.add(ball);     
     return ball;
}

class Pendulum {
     constructor(string, ball, frequency, amplitude){
          this.string = string;
          this.ball = ball;
          this.frequency = frequency;
          this.amplitude = amplitude;
     }
     updateZ45(totalTime){
          this.string.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/2500);
          this.ball.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/2500);
          this.string.rotation.y = Math.sin(Math.PI/3);
          this.ball.rotation.y = Math.sin(Math.PI/3);
     }
    
     updateX45(totalTime){
          this.string.rotation.z = -this.amplitude * Math.cos((this.frequency * totalTime)/2500);
          this.ball.rotation.z = -this.amplitude * Math.cos((this.frequency * totalTime)/2500);
          this.string.rotation.y = Math.sin(-Math.PI * 4/6);
          this.ball.rotation.y = Math.sin(-Math.PI * 4/6);
     }
     updateZ(totalTime){
          this.string.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/2500);
          this.ball.rotation.z = this.amplitude * Math.cos((this.frequency * totalTime)/2500);
          
     }
     updateX(totalTime){
          this.string.rotation.x = this.amplitude * Math.cos((this.frequency * totalTime)/2500);
          this.ball.rotation.x = this.amplitude * Math.cos((this.frequency * totalTime)/2500);
          
     }

     updateY360(totalTime){
          this.string.rotation.y = this.amplitude * ((this.frequency * totalTime)/2500);
          this.ball.rotation.y = this.amplitude * ((this.frequency * totalTime)/2500);
          
     }
     updateZ360(totalTime){
          this.string.rotation.z = this.amplitude * ((this.frequency * totalTime)/2500);
          this.ball.rotation.z = this.amplitude * ((this.frequency * totalTime)/2500);
          
     }
};

export function createPendulum(scene, origin, frequency, amplitude, length, radius, color, texture){
     const stringMesh = createStringMesh(scene, length, color);
     stringMesh.position.add(origin);
     stringMesh.translateY(stringLength);
     stringMesh.geometry.translate(0, -(length * 0.5), 0);

     const ballMesh = createBallMesh(scene, radius, color, texture);
     ballMesh.position.add(origin);
     ballMesh.translateY(stringLength);
     ballMesh.geometry.translate(0, -length, 0);
     ballMeshes.push(ballMesh);
    
     const pendulum = new Pendulum(stringMesh, ballMesh, frequency, amplitude);

     // For Collision detect //
     let ballBoxHelper = new THREE.BoxHelper(ballMesh, 0x00ff00);
     ballBoxHelper.update();
     ballBoxHelper.visible = false;
     boxHelpers.push(ballBoxHelper);
     scene.add(ballBoxHelper);
     ballBB = new THREE.Box3();
     ballBB.setFromObject(ballBoxHelper);
     targets.push(ballBB); 
     
     return pendulum;
};

