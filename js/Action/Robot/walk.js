import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/101/three.module.js'; // モジュール版に変更

export function handleWalk(Robot, leftLeg, rightLeg, leftArm, rightArm, isWalking, currentLegRotation, legRotationDirection, maxLegRotation, targetRotation, speedFromHand, renderer, scene, camera, walls) {
    const raycaster = new THREE.Raycaster();  // レイキャスターを初期化
    const forwardDirection = new THREE.Vector3();

    function animateWalk() {
        if (isWalking.value) {
            // 足と腕の回転処理
            leftLeg.rotation.x += legRotationDirection.value * 0.05;
            rightLeg.rotation.x -= legRotationDirection.value * 0.05;
            currentLegRotation.value += 0.05;

            leftArm.rotation.x -= legRotationDirection.value * 0.05;
            rightArm.rotation.x += legRotationDirection.value * 0.05;

            if (currentLegRotation.value >= maxLegRotation || currentLegRotation.value <= -maxLegRotation) {
                legRotationDirection.value *= -1;
                currentLegRotation.value = 0;
            }

            // ロボットの回転を計算
            Robot.rotation.y += (targetRotation.value - Robot.rotation.y) * 0.05;

            // レイキャスターの方向を設定（ロボットの前方）
            forwardDirection.setFromMatrixPosition(Robot.matrixWorld);  // ロボットの現在位置
            const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(Robot.quaternion);  // ロボットの向いている方向
            raycaster.set(forwardDirection, direction);  // レイキャスターの原点と方向を設定

            const intersections = raycaster.intersectObjects(walls);  // 壁オブジェクトに対して衝突判定を行う

            if (intersections.length >= 1) {
                // 衝突するまでの距離が非常に小さい場合にのみ衝突とみなす（例えば0.1以下）
                if (intersections[0].distance > 0 && intersections[0].distance <= 0.1) {
                    console.log('衝突しました。');
                } else {
                    // ロボットを前進させる
                    Robot.position.z -= Math.cos(Robot.rotation.y) * speedFromHand.value * 0.002;
                    Robot.position.x -= Math.sin(Robot.rotation.y) * speedFromHand.value * 0.002;
                }
            } else {
                // 衝突する壁がない場合は自由に進む
                Robot.position.z -= Math.cos(Robot.rotation.y) * speedFromHand.value * 0.005;
                Robot.position.x -= Math.sin(Robot.rotation.y) * speedFromHand.value * 0.005;
            }


            // レンダリング
            renderer.render(scene, camera);
            requestAnimationFrame(animateWalk);
        }
    }

    // アニメーションを開始
    animateWalk();
}
