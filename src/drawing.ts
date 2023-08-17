import { max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { area } from 'd3-shape';
import type { RaincloudData } from './types';
import type { ScaleLinear, ScaleSequential, ScaleOrdinal } from 'd3-scale';

export function drawHorizontalRaincloudPlot(
  data: RaincloudData,
  ctx: CanvasRenderingContext2D | undefined,
  x: ScaleLinear<number, number>,
  width: number,
  height: number,
  alpha: number,
  cloudColor: string,
  lightningColor: string,
  rainColor: ScaleOrdinal<number, string> | ScaleSequential<string> | string
) {
  if (!ctx) {
    return;
  }

  const padding = 2;

  const cloudHeight = scaleLinear()
    .domain([0, max(data.densities, (d) => d.density) ?? 0])
    .range([height / 2 - padding, 0]);

  const cloudArea = area<{ x: number; density: number }>()
    .x((d) => x(d.x))
    .y0(cloudHeight(0))
    .y1((d) => {
      const yCoord = cloudHeight(d.density);
      return yCoord > 0.01 ? yCoord : 0;
    })
    .context(ctx);

  ctx.save();

  ctx.clearRect(0, 0, width, height);

  // cloud

  ctx.fillStyle = cloudColor;
  ctx.beginPath();
  cloudArea(data.densities);
  ctx.fill();

  // rain

  ctx.globalAlpha = alpha;

  data.values.forEach(({ value, label }) => {
    ctx.beginPath();
    ctx.strokeStyle =
      typeof rainColor === 'function' ? rainColor(label) : rainColor;
    ctx.moveTo(x(value), height / 2 + padding);
    ctx.lineTo(x(value), height);
    ctx.stroke();
  });

  // lightning

  ctx.globalAlpha = 1;
  ctx.fillStyle = lightningColor;
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.arc(x(data.mean), height / 2, 3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
