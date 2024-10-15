export function jump(Robot, isJumping, velocityY, gravity, jumpStrength) {
  if (!isJumping.value) {
    isJumping.value = true;
    velocityY.value = jumpStrength;

    function animateJump() {
      velocityY.value += gravity;
      Robot.position.y += velocityY.value;

      if (Robot.position.y <= 20) {
        Robot.position.y = 20;
        velocityY.value = 0;
        isJumping.value = false;
      } else {
        requestAnimationFrame(animateJump);
      }
    }

    requestAnimationFrame(animateJump);
  }
}
