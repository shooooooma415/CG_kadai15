export function createCamera(width, height) {
  // カメラを作成
  const camera = new THREE.PerspectiveCamera(60, width / height);
  camera.position.set(50, 70, -100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  return camera;
}

export function addLights(scene) {
  // 光源を追加
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
}
