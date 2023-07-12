<script lang="ts">
  import XAxis from './XAxis.svelte';
  import YAxis from './YAxis.svelte';
  import { scaleLinear, type NumberValue } from 'd3-scale';
  import { ascending, bisectCenter } from 'd3-array';
  import { line as d3line } from 'd3-shape';
  import { drawnPDPs } from '../stores';
  import type { OneWayPD } from '../types';

  export let pd: OneWayPD;

  const width = 300;
  const height = 200;

  const marginTop = 10;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 30;

  const x = scaleLinear()
    .domain([Math.min(...pd.x_values), Math.max(...pd.x_values)])
    .range([marginLeft, width - marginRight]);

  const y = scaleLinear()
    .domain([pd.pdp_min, pd.pdp_max])
    .range([height - marginBottom, marginTop]);

  const line = d3line()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]));

  let points = new Map();
  $: linePonts = Array.from(points).sort((a, b) => ascending(a[0], b[0]));

  function draw(event: {
    buttons: number;
    offsetX: NumberValue;
    offsetY: NumberValue;
  }) {
    if (event.buttons !== 1) {
      return;
    }
    const rawX = x.invert(event.offsetX);
    const rawY = y.invert(event.offsetY);
    const index = bisectCenter(pd.x_values, rawX);
    const roundX = pd.x_values[index];

    points.set(roundX, rawY);
    points = points;
    $drawnPDPs[pd.feature] = points;
  }
</script>

<svg {width} {height}>
  <rect {width} {height} fill="white" />
  <XAxis scale={x} y={height - marginBottom} />
  <YAxis scale={y} x={marginLeft} />

  <!-- TODO: figure out how to do this accessibly -->
  <g role="presentation" on:mousemove={draw} on:mousedown={draw}>
    <rect
      x={0}
      y={marginTop}
      {width}
      height={height - marginTop - marginBottom}
      fill="transparent"
    />

    <g>
      {#each Array.from(points) as [px, py]}
        <circle
          cx={x(px)}
          cy={y(py)}
          r="3"
          fill="steelblue"
          pointer-events="none"
        />
      {/each}
    </g>

    <path
      d={line(linePonts)}
      fill="none"
      stroke="steelblue"
      pointer-events="none"
    />
  </g>
</svg>

<style>
</style>
