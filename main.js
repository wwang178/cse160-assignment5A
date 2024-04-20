import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    // camera
    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 15, 20);

    // orbit controls
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    // scene
    const scene = new THREE.Scene();

    // light
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 5, 5);
    scene.add(light);

    // light
    const light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(0, 5, -5);
    light2.rotation.set(0, 180, 0);
    scene.add(light2);

    // cubes
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({ color });

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;

        return cube;
    }

    const cubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844, 2),
    ];

    // sphere
    const loader = new THREE.TextureLoader();
    const texture = loader.load('resources/images/disco2.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;

    const sphereGeometry = new THREE.SphereGeometry(
        5,
        10,
        10
    );
    const sphereColor = 0xFF00FF;
    const sphereMaterial = new THREE.MeshPhongMaterial({ map: texture });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 5, -15);
    scene.add(sphere);

    //cylinder
    const cylinderGeometry = new THREE.CylinderGeometry(
        4,
        4,
        1
    );
    const cylinderColor = 0xFFFFFF;
    const cylinderMaterial = new THREE.MeshPhongMaterial({ color: cylinderColor });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(0, -2, -5);
    scene.add(cylinder);

    // obj file
    let lobster;

    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    mtlLoader.load('resources/models/lobster/lobster.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load('resources/models/lobster/lobster.obj', (root) => {
            root.position.set(0, 0, -5);
            root.scale.set(10, 10, 10);
            root.rotation.set(0, Math.PI / 2, 0);
            scene.add(root);
            lobster = root;
        });
    });


    // rendering
    function resizeRendererToDisplaySize(renderer) {

        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;

    }

    function render(time) {
        time *= 0.001;  // convert time to seconds

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        cubes.forEach((cube, ndx) => {

            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;

        });

        if (lobster)
            lobster.rotation.y += 0.01;

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }



    requestAnimationFrame(render);
}

main();