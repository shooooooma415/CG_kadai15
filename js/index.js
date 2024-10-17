import { createMaze3D } from './Action/Maze/createMaze3D.js';
import { createRobot } from './UIComponents/robot.js';
import { handleWalk } from './Action/Robot/walk.js';
import { fireCannon, animateBullets } from './Action/Robot/canon.js';
import { swingSword } from './Action/Robot/sword.js';
import { jump } from './Action/Robot/jump.js';
import { resetRobotPosition } from './Action/Robot/reset.js';
import { createCamera, updateCameraPosition, addLights } from './UIComponents/environment.js';

let renderer, camera, scene;

window.addEventListener("DOMContentLoaded", init);

function init() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("#myCanvas")
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);

    scene = new THREE.Scene();
    camera = createCamera();
    addLights(scene);

    const walls = createMaze3D(scene);


    const startX = 1;
    const startZ = 1;
    const Robot = createRobot(scene, startX, 1, startZ);

    let sword = Robot.children[3].children[2];
    let isSwordEquipped = true;

    const isJumping = { value: false };
    const velocityY = { value: 0 };
    const gravity = -0.05;
    const jumpStrength = 1.5;

    const bullets = [];
    const bulletMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    const leftLeg = Robot.children[2].children[0];
    const rightLeg = Robot.children[2].children[1];
    const leftArm = Robot.children[3].children[0];
    const rightArm = Robot.children[3].children[1];

    let isWalking = { value: false };
    let currentLegRotation = { value: 0 };
    let legRotationDirection = { value: 1 };
    let maxLegRotation = Math.PI / 8;
    let targetRotation = { value: 0 };
    let speedFromHand = { value: 0 };

    const videoElement = document.createElement('video');
    videoElement.style.width = "800px";
    videoElement.style.height = "500px";
    videoElement.style.position = "absolute";
    videoElement.style.right = "0";
    videoElement.style.bottom = "0";
    videoElement.style.transform = "scaleX(-1)"; // 鏡のように反転
    document.body.appendChild(videoElement);

    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    const cameraUtils = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 640,
        height: 480
    });
    cameraUtils.start();

    function onResults(results) {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const handLandmarks = results.multiHandLandmarks[0];
            const handX = handLandmarks[0].x; 
            const handY = handLandmarks[0].y; 

            const rotationFromHand = (handX - 0.5) * Math.PI * 2;
            targetRotation.value = rotationFromHand;

            speedFromHand.value = 1 - handY; // Y軸の動きに基づいて速度を調整

            isWalking.value = true; // 手が認識されたら歩行
            handleWalk(Robot, leftLeg, rightLeg, leftArm, rightArm, isWalking, currentLegRotation, legRotationDirection, maxLegRotation, targetRotation, speedFromHand, renderer, scene, camera, walls);
        } else {
            isWalking.value = false;
        }
    }


    document.addEventListener("keydown", (event) => {
        if (event.key === ' ') {  
            if (isSwordEquipped) {
                swingSword(sword);
            }
        }
        if (event.key === 'j') { 
            jump(Robot, isJumping, velocityY, gravity, jumpStrength);
        }
        if (event.key === 'c') {
            fireCannon(scene, Robot, bullets, bulletMaterial);
        }
        if (event.key === 'r') {
            resetRobotPosition(Robot, () => renderer.render(scene, camera));
        }
    });

    // レンダリング関数
    function render() {
        updateCameraPosition(camera, Robot);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    animateBullets(bullets, scene);
    render();
}

// ウィンドウリサイズに対応
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
