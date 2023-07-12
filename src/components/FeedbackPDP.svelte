<script lang="ts">
  import XAxis from './XAxis.svelte';
  import YAxis from './YAxis.svelte';
  import { scaleLinear } from 'd3-scale';
  import { ascending, zip } from 'd3-array';
  import { line as d3line } from 'd3-shape';
  import type { OneWayPD } from '../types';

  export let pd: OneWayPD;
  export let drawn: Map<number, number>;

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

  $: drawnPoints = Array.from(drawn).sort((a, b) => ascending(a[0], b[0]));
  $: actualPoints = zip(pd.x_values, pd.mean_predictions) as [number, number][];
</script>

<svg {width} {height}>
  <rect {width} {height} fill="white" />
  <XAxis scale={x} y={height - marginBottom} />
  <YAxis scale={y} x={marginLeft} />

  <g>
    <rect
      x={0}
      y={marginTop}
      {width}
      height={height - marginTop - marginBottom}
      fill="transparent"
    />

    <g>
      <g>
        {#each actualPoints as [px, py]}
          <circle
            cx={x(px)}
            cy={y(py)}
            r="3"
            fill="crimson"
            pointer-events="none"
          />
        {/each}
      </g>

      <path
        d={line(actualPoints)}
        fill="none"
        stroke="crimson"
        pointer-events="none"
      />
    </g>

    <g>
      <g>
        {#each drawnPoints as [px, py]}
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
        d={line(drawnPoints)}
        fill="none"
        stroke="steelblue"
        pointer-events="none"
      />
    </g>
  </g>
</svg>

<style>
</style>
