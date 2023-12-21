import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const width = window.innerWidth;
const height = window.innerHeight;
const aspect_ratio = width / height;

// Create the scene
const scene = new THREE.Scene();


// Create light
const light = new THREE.DirectionalLight()
light.position.set(1, 0, 0)
light.intensity = 3
const lightGroup = new THREE.Group()
lightGroup.add(light)
scene.add(lightGroup)

const light2 = new THREE.AmbientLight( 0xffffff ); // soft white light
light2.intensity = 0.02
scene.add( light2 );

// Create the camera
const camera = new THREE.OrthographicCamera( - 2 * aspect_ratio, 2 * aspect_ratio, 2, -2, 0.1, 10 );
camera.position.set(0, 0, 2);


// TEXTURES
const loader = new THREE.TextureLoader();
const earthTexture = loader.load("assets/earth.jpg");


// MATERIALS
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture })

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000})

const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff})

// GEOMETRY

const earthGeometry = new THREE.SphereGeometry(1, 64, 32);


const lineGeometry = new THREE.BufferGeometry()
lineGeometry.setFromPoints([ new THREE.Vector3( 0, 10, 0 ), new THREE.Vector3( 0, -10, 0 ) ])

const circle = new THREE.EllipseCurve(
  0,  0,            // ax, aY
  1, 1,           // xRadius, yRadius
  0,  2 * Math.PI,  // aStartAngle, aEndAngle
  false,            // aClockwise
  0                 // aRotation
);
const points = circle.getPoints( 50 );
const circleGeometry = new THREE.BufferGeometry().setFromPoints( points );

const cylinderGeometry = new THREE.CylinderGeometry( 0.025, 0.025, 0.2, 12)



// MESHES
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
// earthMesh.castShadow = true;


const axis = new THREE.Line(lineGeometry, lineMaterial)

const equator = new THREE.Line(circleGeometry, lineMaterial)
equator.rotation.x = Math.PI / 2
equator.scale.setScalar(1.002)

const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
// cylinder.receiveShadow = true
cylinder.translateX(1)
cylinder.rotateZ(Math.PI / 2)
const cylinderLatGroup = new THREE.Group()
cylinderLatGroup.add(cylinder)
cylinderLatGroup.rotation.z = 44.8 / 180 * Math.PI
const cylinderLonGroup = new THREE.Group()
cylinderLonGroup.add(cylinderLatGroup)
cylinderLonGroup.rotation.y = 10.3 / 180 * Math.PI

const earthGroup = new THREE.Group()
earthGroup.add(earthMesh, axis, equator, cylinderLonGroup)
earthGroup.rotateZ( 23.4 / 180 * Math.PI)
scene.add(earthGroup)


// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;

// Append the renderer to the page
document.body.appendChild( renderer.domElement );

// Orbit Controls
const controls = new OrbitControls( camera, renderer.domElement )
controls.enablePan = false


const revBack = document.getElementById("revBack")
const rotBack = document.getElementById("rotBack")
const latBack = document.getElementById("latBack")
const lonBack = document.getElementById("lonBack")
const revFwd = document.getElementById("revFwd")
const rotFwd = document.getElementById("rotFwd")
const latFwd = document.getElementById("latFwd")
const lonFwd = document.getElementById("lonFwd")

let revMove = 0
let rotMove = 0
let latMove = 0
let lonMove = 0

revBack.addEventListener("mousedown", (e) => {revMove = -1})
revBack.addEventListener("mouseup", (e) => {revMove = 0})
revFwd.addEventListener("mousedown", (e) => {revMove = 1})
revFwd.addEventListener("mouseup", (e) => {revMove = 0})
rotBack.addEventListener("mousedown", (e) => {rotMove = -1})
rotBack.addEventListener("mouseup", (e) => {rotMove = 0})
rotFwd.addEventListener("mousedown", (e) => {rotMove = 1})
rotFwd.addEventListener("mouseup", (e) => {rotMove = 0})
latBack.addEventListener("mousedown", (e) => {latMove = -1})
latBack.addEventListener("mouseup", (e) => {latMove = 0})
latFwd.addEventListener("mousedown", (e) => {latMove = 1})
latFwd.addEventListener("mouseup", (e) => {latMove = 0})
lonBack.addEventListener("mousedown", (e) => {lonMove = -1})
lonBack.addEventListener("mouseup", (e) => {lonMove = 0})
lonFwd.addEventListener("mousedown", (e) => {lonMove = 1})
lonFwd.addEventListener("mouseup", (e) => {lonMove = 0})

revBack.addEventListener("touchstart", (e) => {revMove = -1})
revBack.addEventListener("touchend", (e) => {revMove = 0})
revFwd.addEventListener("touchstart", (e) => {revMove = 1})
revFwd.addEventListener("touchend", (e) => {revMove = 0})
rotBack.addEventListener("touchstart", (e) => {rotMove = -1})
rotBack.addEventListener("touchend", (e) => {rotMove = 0})
rotFwd.addEventListener("touchstart", (e) => {rotMove = 1})
rotFwd.addEventListener("touchend", (e) => {rotMove = 0})
latBack.addEventListener("touchstart", (e) => {latMove = -1})
latBack.addEventListener("touchend", (e) => {latMove = 0})
latFwd.addEventListener("touchstart", (e) => {latMove = 1})
latFwd.addEventListener("touchend", (e) => {latMove = 0})
lonBack.addEventListener("touchstart", (e) => {lonMove = -1})
lonBack.addEventListener("touchend", (e) => {lonMove = 0})
lonFwd.addEventListener("touchstart", (e) => {lonMove = 1})
lonFwd.addEventListener("touchend", (e) => {lonMove = 0})

// Rendering loop
function render() {
  renderer.render( scene, camera )
  lightGroup.rotateY(revMove * 0.01)
  earthGroup.rotateY(rotMove * 0.01)
  cylinderLatGroup.rotation.z = Math.min( Math.PI / 2, Math.max(- Math.PI / 2, cylinderLatGroup.rotation.z + latMove * 0.01))
  cylinderLonGroup.rotateY(lonMove * 0.01)
}

renderer.setAnimationLoop(render)

// Resizer
function resize() {				
  const width = window.innerWidth * 0.99;
  const height = window.innerHeight * 0.99;
  const aspect_ratio = width / height;
  renderer.setSize( width, height );
  camera.left = camera.bottom * aspect_ratio;
  camera.right = camera.top * aspect_ratio;
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', () => resize())

