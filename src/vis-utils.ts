import { format } from 'd3-format';
import { scaleLinear } from 'd3-scale';
import { zip } from 'd3-array';
import type { OneWayPD } from './types';

export function defaultFormat(x: number): string {
  /* [0, 1] is a common range for predictions and features.
  With SI suffixes, 0.5 becomes 500m. I'd rather it just be 0.5. */

  if ((x >= 0.001 && x <= 1) || (x >= -1 && x <= 0.001)) {
    return format('.3~f')(x);
  } else {
    return format('~s')(x);
  }
}

export function getNiceDomain(x: [number, number]): [number, number] {
  const niceExtent = scaleLinear().domain(x).nice().domain();
  return [niceExtent[0], niceExtent[1]];
}

export function pdToXY(pd: OneWayPD): { x: number; y: number }[] {
  return zip(pd.x_values, pd.mean_predictions).map(([x, y]) => ({
    x,
    y,
  }));
}
