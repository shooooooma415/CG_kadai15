import { createMaze3D } from './Action/Maze/createMaze3D.js';
import { createRobot } from './UIComponents/robot.js';
import { handleWalk } from './Action/Robot/walk.js';
import { fireCannon, animateBullets } from './Action/Robot/canon.js';
import { swingSword } from './Action/Robot/sword.js';
import { jump } from './Action/Robot/jump.js';
import { resetRobotPosition } from './Action/Robot/reset.js';
import { createCamera, updateCameraPosition, addLights, changeBackground } from './UIComponents/environment.js';

let renderer, camera, scene;
let isControlMode = false;

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
    changeBackground(renderer);

    const walls = createMaze3D(scene);

    const startX = 1;
    const startZ = 1;
    const goalX = 19;  // ゴールのX位置（右上）
    const goalZ = 19;  // ゴールのZ位置（右上）
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
    videoElement.style.width = "600px";
    videoElement.style.height = "400px";
    videoElement.style.position = "absolute";
    videoElement.style.right = "0";
    videoElement.style.bottom = "0";
    videoElement.style.transform = "scaleX(-1)";
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

            speedFromHand.value = 1 - handY;

            isWalking.value = true;
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
            if (!isJumping.value) {
                isJumping.value = true;
                jump(Robot, isJumping, velocityY, gravity, jumpStrength);
            }
        }
        if (event.key === 'c') {
            fireCannon(scene, Robot, bullets, bulletMaterial);
        }
        if (event.key === 'r') {
            resetRobotPosition(Robot, () => renderer.render(scene, camera));
        }
        if (event.key === 's') {
            isControlMode = !isControlMode;
        }

        if (isControlMode && !isJumping.value) {
            let newX, newZ;
            if (event.key === 'ArrowUp') {
                newX = Robot.position.x - Math.sin(Robot.rotation.y) * 0.1;
                newZ = Robot.position.z - Math.cos(Robot.rotation.y) * 0.1;
            } else if (event.key === 'ArrowDown') {
                newX = Robot.position.x + Math.sin(Robot.rotation.y) * 0.1;
                newZ = Robot.position.z + Math.cos(Robot.rotation.y) * 0.1;
            } else if (event.key === 'ArrowLeft') {
                Robot.rotation.y += 0.05;
            } else if (event.key === 'ArrowRight') {
                Robot.rotation.y -= 0.05;
            }

            if (newX !== undefined && newZ !== undefined) {
                const raycaster = new THREE.Raycaster();
                const direction = new THREE.Vector3(newX - Robot.position.x, 0, newZ - Robot.position.z).normalize();
                raycaster.set(Robot.position, direction);
                const intersections = raycaster.intersectObjects(walls);

                if (intersections.length === 0 || intersections[0].distance > 0.1) {
                    Robot.position.set(newX, Robot.position.y, newZ);
                } else {
                    console.log("衝突しました。");
                }
            }
        }
    });

    function checkGoal() {
        const distanceToGoal = Math.sqrt((Robot.position.x - goalX) ** 2 + (Robot.position.z - goalZ) ** 2);
        if (distanceToGoal < 1) {
            const goalMessage = document.createElement("div");
            goalMessage.textContent = "ゴール!";
            goalMessage.style.position = "absolute";
            goalMessage.style.top = "50%";
            goalMessage.style.left = "50%";
            goalMessage.style.transform = "translate(-50%, -50%)";
            goalMessage.style.fontSize = "3em";
            goalMessage.style.color = "yellow";
            document.body.appendChild(goalMessage);

            setTimeout(() => {
                location.reload();
            }, 5000);
        }
    }

    function render() {
        updateCameraPosition(camera, Robot);
        checkGoal();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    animateBullets(bullets, scene);
    render();
}

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
