import { format } from 'd3-format';
import { scaleLinear } from 'd3-scale';
import { mean, zip } from 'd3-array';
import type { OneWayPD, RaincloudData } from './types';
import { density1d } from 'fast-kde';

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

// Adapted from https://www.html5rocks.com/en/tutorials/canvas/hidpi/
export function scaleCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  // assume the device pixel ratio is 1 if the browser doesn't specify it
  const devicePixelRatio = window.devicePixelRatio || 1;

  // set the 'real' canvas size to the higher width/height
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;

  // ...then scale it back down with CSS
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // scale the drawing context so everything will work at the higher ratio
  context.scale(devicePixelRatio, devicePixelRatio);
}

export function getRaincloudData(
  values: number[],
  labels: number[] | null = null
): RaincloudData {
  const combinedValues = labels
    ? zip(values, labels).map(([value, label]) => ({ value, label }))
    : values.map((value) => ({ value, label: 0 }));

  let densities: { x: number; density: number }[] = [];

  // computing the KDE requires at least two data points
  if (values.length > 1) {
    const kde = density1d(values, { pad: 0, bins: 32 });
    densities = Array.from(kde, ({ x, y }) => ({ x, density: y }));
  }

  const meanValue = mean(values) ?? 0;

  return {
    values: combinedValues,
    densities: densities,
    mean: meanValue,
  };
}

/**
 * Centers the ICE lines.
 * @param iceLines standard ICE lines
 * @returns centered ICE lines
 */
export function centerIceLines(iceLines: number[][]): number[][] {
  return iceLines.map((line) => line.map((d) => d - line[0]));
}

export const categoricalColors = {
  light: [
    '#a6cee3',
    '#fdbf6f',
    '#b2df8a',
    '#fb9a99',
    '#cab2d6',
    '#FFB3F2',
    '#D4906D',
  ],
  medium: [
    '#67a3cb',
    '#fea13f',
    '#7abf5a',
    '#f4645d',
    '#9c76b7',
    '#fb9ada',
    '#c3744a',
  ],
  dark: [
    '#1f78b4',
    '#ff7f00',
    '#33a02c',
    '#e31a1c',
    '#6a3d9a',
    '#f781bf',
    '#B15928',
  ],
};
