import { format } from 'd3-format';
export { defaultFormat };

function defaultFormat(x: number): string {
  /* [0, 1] is a common range for predictions and features.
  With SI suffixes, 0.5 becomes 500m. I'd rather it just be 0.5. */

  if ((x >= 0.001 && x <= 1) || (x >= -1 && x <= 0.001)) {
    return format('.3~f')(x);
  } else {
    return format('~s')(x);
  }
}
