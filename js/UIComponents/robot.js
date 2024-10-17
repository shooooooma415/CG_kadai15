export function createRobot(scene,startX,startY,startZ) {
  // マテリアルを作成
  const headMaterial = new THREE.MeshNormalMaterial({ color: 0xff0000 });
  const eyesMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff46 });
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
  const cannonMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const swordMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

  // 頭の作成
  const head = new THREE.Mesh(new THREE.BoxGeometry(20, 16, 16), headMaterial);

  const eye1 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 12), eyesMaterial);
  eye1.position.set(5, 3, -8);

  const eye2 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 12), eyesMaterial);
  eye2.position.set(-5, 3, -8);

  const Head = new THREE.Group();
  Head.add(head, eye1, eye2);

  // 体の作成
  const body = new THREE.Mesh(new THREE.BoxGeometry(18, 14, 12), bodyMaterial);
  body.position.set(0, -10, 0);
  

  const cannon = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 10, 32), cannonMaterial);
  cannon.position.set(0, -10, -6);
  cannon.rotation.set(Math.PI / 2, 0, 0);

  const Body = new THREE.Group();
  Body.add(body, cannon);
  Body.scale.set(0.01, 0.01, 0.01);

  Head.position.set(0, 5, 0);
  

  // 足の作成
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 20, 16), legMaterial);
  leftLeg.position.set(-6, -20, 0);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 20, 16), legMaterial);
  rightLeg.position.set(6, -20, 0);

  const Legs = new THREE.Group();
  Legs.add(leftLeg, rightLeg);

  // 腕の作成
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 15, 16), armMaterial);
  leftArm.position.set(-12, -5, 0);
  leftArm.rotation.z = Math.PI / 3;

  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 15, 16), armMaterial);
  rightArm.position.set(12, -5, 0);
  rightArm.rotation.z = -Math.PI / 3;

  const Arms = new THREE.Group();
  Arms.add(leftArm, rightArm);

  // 剣の作成（見た目のみ）
  const swordGeometry = new THREE.BoxGeometry(3, 30, 2);
  swordGeometry.translate(0, 15, 0);
  const sword = new THREE.Mesh(swordGeometry, swordMaterial);
  sword.position.set(18, -2, 0);
  sword.rotation.z = -Math.PI / 4;
  Arms.add(sword);

  // ロボット全体をグループ化
  const Robot = new THREE.Group();
  Robot.add(Head, Body, Legs, Arms);

  Robot.position.set(startX, startY, startZ);
  Robot.scale.set(0.01, 0.01, 0.01);
  
  scene.add(Robot);

  return Robot;
}
