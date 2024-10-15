export function fireCannon(scene, Robot, bullets, bulletMaterial) {
  // 弾丸の作成
  const bullet = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), bulletMaterial);

  // 弾丸の初期位置（ロボットの位置を基準に）
  const initialPosition = {
    x: Robot.position.x - Math.sin(Robot.rotation.y) * 6,
    y: Robot.position.y - 10,
    z: Robot.position.z - Math.cos(Robot.rotation.y) * 6,
  };

  // 弾丸の移動方向（ロボットの向きを基準に）
  const initialDirection = {
    x: -Math.sin(Robot.rotation.y),
    z: -Math.cos(Robot.rotation.y),
  };

  bullet.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
  bullet.userData = { direction: initialDirection }; // 弾丸の移動方向を保存
  bullets.push(bullet); // 弾丸をリストに追加
  scene.add(bullet); // シーンに追加
}

export function animateBullets(bullets, scene) {
  // 弾丸を移動させる
  bullets.forEach((bullet, index) => {
    const direction = bullet.userData.direction;
    bullet.position.x += direction.x * 0.5; // 弾丸の速度
    bullet.position.z += direction.z * 0.5; // 弾丸の速度

    // 画面外に出た弾丸をシーンから削除
    if (bullet.position.z > 100 || bullet.position.x > 100 || bullet.position.z < -100 || bullet.position.x < -100) {
      scene.remove(bullet);
      bullets.splice(index, 1); // リストからも削除
    }
  });

  // アニメーションを再帰的に呼び出す
  requestAnimationFrame(() => animateBullets(bullets, scene));
}
