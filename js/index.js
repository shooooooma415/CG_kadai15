import { createRobot } from './UIComponents/robot.js';
import { createCamera, addLights } from './UIComponents/environment.js';
import { fireCannon, animateBullets } from './Action/Robot/canon.js';
import { swingSword } from './Action/Robot/sword.js';
import { jump } from './Action/Robot/jump.js';
import { handleWalk } from './Action/Robot/walk.js';

window.addEventListener("DOMContentLoaded", init);

function init() {
  const width = 1500;
  const height = 800;

  // レンダラーを作成 
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas")
  });
  renderer.setSize(width, height); /* ウィンドウサイズの設定 */
  renderer.setClearColor(0x000000); /* 背景色の設定 */

  // シーンを作成 
  const scene = new THREE.Scene();

  // 環境設定からカメラと光源を取得
  const camera = createCamera(width, height);
  addLights(scene);

  // ロボットを作成してシーンに追加
  const Robot = createRobot(scene);

  let sword = Robot.children[3].children[2]; // 剣の参照
  let isSwordEquipped = true;

  // ジャンプ関連の状態管理
  const isJumping = { value: false };
  const velocityY = { value: 0 };
  const gravity = -0.05;
  const jumpStrength = 1.5;

  // 大砲関連
  const bullets = [];
  const bulletMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

  // 歩行関連
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

  // MediaPipe Hand Trackingの初期化
  const videoElement = document.createElement('video');
  videoElement.style.width = "320px";
  videoElement.style.height = "240px";
  videoElement.style.position = "absolute";
  videoElement.style.right = "0";
  videoElement.style.bottom = "0";
  videoElement.style.transform = "scaleX(-1)";  // 鏡のように反転
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

  // 手の動きに基づいてロボットの方向と移動を変える
  function onResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const handLandmarks = results.multiHandLandmarks[0];
      const handX = handLandmarks[0].x; // 手のX座標
      const handY = handLandmarks[0].y; // 手のY座標

      // 手のX座標を使って回転の方向を決定
      const rotationFromHand = (handX - 0.5) * Math.PI * 2; // X軸の動きを-πからπの範囲にマッピング
      targetRotation.value = rotationFromHand;

      // 手のY座標を使って速度を制御
      speedFromHand.value = 1 - handY; // Y軸の動きに基づいて速度を調整

      isWalking.value = true; // 手が認識されたら歩行
      handleWalk(Robot, leftLeg, rightLeg, leftArm, rightArm, isWalking, currentLegRotation, legRotationDirection, maxLegRotation, targetRotation, speedFromHand, renderer, scene, camera);
    } else {
      isWalking.value = false; // 手が検出されない場合は歩行を停止
    }
  }

  // キーボード操作を設定
  document.addEventListener("keydown", (event) => {
    if (event.key === ' ') {  // スペースキーで剣を振る
      if (isSwordEquipped) {
        swingSword(sword);
      }
    }
    if (event.key === 'j') {  // 'J' キーでジャンプ
      jump(Robot, isJumping, velocityY, gravity, jumpStrength);
    }
    if (event.key === 'c') {  // 'C' キーで大砲を撃つ
      fireCannon(scene, Robot, bullets, bulletMaterial);
    }
  });

  // レンダリング関数
  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  // 弾丸のアニメーションを開始
  animateBullets(bullets, scene);
  render();
}
