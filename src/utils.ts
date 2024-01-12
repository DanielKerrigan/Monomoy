/**
 * Checks if two arrays are equal to each other.
 * @param a first array
 * @param b second array
 * @param eq function that checks the equality of two array elements
 * @returns `true` if the two arrays are equal and `false` otherwise
 */
export function areArraysEqual<T>(
  a: T[],
  b: T[],
  eq: (a: T, b: T) => boolean = (x: T, y: T) => x === y
): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (!eq(a[i], b[i])) {
      return false;
    }
  }

  return true;
}
