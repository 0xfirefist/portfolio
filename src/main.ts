import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import typefaceFont from "three/examples/fonts/optimer_regular.typeface.json";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const scene = new THREE.Scene();

const fontLoader = new FontLoader();
const font = fontLoader.parse(typefaceFont);

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/2.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

const rgbeLoader = new RGBELoader();
rgbeLoader.load("/env.hdr", (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = environmentMap;
    scene.environment = environmentMap;
});

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const axisHeler = new THREE.AxesHelper(5);
// scene.add(axisHeler);

// Object
const textGeometry = new TextGeometry("     Builder\nBeing Creative", {
    font: font,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 10,
    height: 0.2,
});
textGeometry.center();
textGeometry.rotateX(-Math.PI * 0.25);
textGeometry.rotateZ(-Math.PI * 0.05);
textGeometry.center();

const material = new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;
// material.wireframe = true;
const mesh = new THREE.Mesh(textGeometry, material);

scene.add(mesh);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.z = 6;
camera.lookAt(mesh.position);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/**
 * Animate
 */

// const clock = new THREE.Clock();
const tick = () => {
    // const elapsedTime = clock.getElapsedTime();
    // mesh.position.y = Math.sin(elapsedTime);
    renderer.render(scene, camera);

    controls.update();
    window.requestAnimationFrame(tick);
};
tick();

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
});
