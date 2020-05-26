/**
 * Returns a css calc expression to smoothly scale a value between two
 * breakpoints (linear interpolation), clamping the value to stop at either end.
 *
 * @param x1 The first breakpoint.
 * @param y1 The value at the first breakpoint.
 * @param x2 The second breakpoint.
 * @param y2 The value at the second breakpoint.
 * @see {@link https://caniuse.com/#feat=mdn-css_types_clamp Browser support for clamp()}
 */
export function csslerp(x1: number, y1: number, x2: number, y2: number): string {
  return `clamp(${Math.min(y1, y2)}px, ${csslerpUnclamped(x1, y1, x2, y2)}, ${Math.max(y1, y2)}px)`;
}

/**
 * Returns a css calc expression to smoothly scale a value between two
 * breakpoints (linear interpolation).
 *
 * Without clamping, the value will be extrapolated beyond the breakpoints. If
 * `clamp()` cannot be used, the range can alternatively be limited using media
 * queries or min/maxHeight(Width).
 *
 * @param x1 The first breakpoint.
 * @param y1 The value at the first breakpoint.
 * @param x2 The second breakpoint.
 * @param y2 The value at the second breakpoint.
 */
export function csslerpUnclamped(x1: number, y1: number, x2: number, y2: number): string {
  if (x1 == x2) {
    throw new Error('The same breakpoint was given to csslerp twice.');
  }
  let slope = (y2 - y1) / (x2 - x1);
  let intercept = y1 - (slope * x1);
  return `calc(${slope * 100}vw + ${intercept}px)`;
}
