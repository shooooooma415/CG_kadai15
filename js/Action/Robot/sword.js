export function swingSword(sword) {
  let swingAngle = Math.PI / 2;
  const swingSpeed = 0.1;

  function animateSwing() {
    if (swingAngle > 0) {
      sword.rotation.x -= swingSpeed;
      swingAngle -= swingSpeed;
      requestAnimationFrame(animateSwing);
    } else {
      sword.rotation.x = 0;
    }
  }

  animateSwing();
}
