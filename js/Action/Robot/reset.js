export function resetRobotPosition(Robot, render) {
  const initialPosition = { x: Robot.position.x, y: Robot.position.y, z: Robot.position.z };
  const targetPosition = { x: 1, y: 1, z: 1 };

  const duration = 1000;
  let startTime = null;

  function animateReset(time) {
    if (!startTime) startTime = time;
    const progress = (time - startTime) / duration;

    if (progress < 1) {
      Robot.position.x = initialPosition.x + (targetPosition.x - initialPosition.x) * progress;
      Robot.position.y = initialPosition.y + (targetPosition.y - initialPosition.y) * progress;
      Robot.position.z = initialPosition.z + (targetPosition.z - initialPosition.z) * progress;
      requestAnimationFrame(animateReset);
    } else {
      Robot.position.set(1, 1, 1);
    }

    render();
  }

  requestAnimationFrame(animateReset);
}
