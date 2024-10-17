import { checkCollision } from '../Maze/hitJudgment.js'; // 当たり判定を追加

export function handleWalk(Robot, leftLeg, rightLeg, leftArm, rightArm, isWalking, currentLegRotation, legRotationDirection, maxLegRotation, targetRotation, speedFromHand, renderer, scene, camera, walls) {
    function animateWalk() {
        if (isWalking.value) {
            // 足の回転を設定
            leftLeg.rotation.x += legRotationDirection.value * 0.05;
            rightLeg.rotation.x -= legRotationDirection.value * 0.05;
            currentLegRotation.value += 0.05;

            // 腕の回転を設定（足と逆の方向に回転）
            leftArm.rotation.x -= legRotationDirection.value * 0.05;
            rightArm.rotation.x += legRotationDirection.value * 0.05;

            // 回転の制限
            if (currentLegRotation.value >= maxLegRotation || currentLegRotation.value <= -maxLegRotation) {
                legRotationDirection.value *= -1;
                currentLegRotation.value = 0;
            }

            // 回転方向の制御
            Robot.rotation.y += (targetRotation.value - Robot.rotation.y) * 0.05;

            // 移動先の計算
            const deltaX = -Math.sin(Robot.rotation.y) * speedFromHand.value * 0.2;
            const deltaZ = -Math.cos(Robot.rotation.y) * speedFromHand.value * 0.2;

            // 当たり判定をチェック
            const newX = Robot.position.x + deltaX;
            const newZ = Robot.position.z + deltaZ;

            if (!checkCollision(newX, newZ, walls)) {
                Robot.position.x = newX;
                Robot.position.z = newZ;
            }

            // レンダリング
            renderer.render(scene, camera);
            requestAnimationFrame(animateWalk);
        }
    }

    // アニメーションを開始
    animateWalk();
}
