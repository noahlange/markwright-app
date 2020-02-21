/**
 * Code based on similar function in:
 * https://github.com/anvaka/panzoom
 */
export function getScaleMultiplier(delta: number): number {
  const speed = 0.065;
  let scaleMultiplier = 1;
  if (delta > 0) {
    // zoom out
    scaleMultiplier = 1 - speed;
  } else if (delta < 0) {
    // zoom in
    scaleMultiplier = 1 + speed;
  }
  return scaleMultiplier;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}
