export function createCamera() {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, -10);  // 初期位置をロボットの後方に配置
  return camera;
}

// カメラをロボットに追従させる関数
export function updateCameraPosition(camera, robot) {
  const offset = new THREE.Vector3(0, 5, -5); // ロボットの背後（高さ5、距離10）の位置にカメラを設定

  // ロボットの現在の位置を取得し、カメラの位置を更新
  const robotPosition = new THREE.Vector3();
  robot.getWorldPosition(robotPosition);
  const cameraPosition = robotPosition.clone().add(offset);

  // カメラの位置をロボットの後方に設定し、ロボットを注視する
  camera.position.copy(cameraPosition);
  camera.lookAt(robotPosition);
}

export function addLights(scene) {
  // 光源を追加
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
}

export function changeBackground(renderer) {
  renderer.setClearColor(0x87CEEB);
}
