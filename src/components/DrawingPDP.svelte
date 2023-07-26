<script lang="ts">
  import XAxis from './XAxis.svelte';
  import YAxis from './YAxis.svelte';
  import { scaleLinear, scalePoint } from 'd3-scale';
  import { bisectCenter } from 'd3-array';
  import { line as d3line } from 'd3-shape';
  import {
    drawn_pds,
    feature_info,
    model_output_short,
    pdExtentNice,
  } from '../stores';
  import type { OneWayPD } from '../types';

  export let pd: OneWayPD;
  export let width = 300;
  export let height = 200;

  const marginTop = 12;
  const marginRight = 24;
  const marginBottom = 32;
  const marginLeft = 56;

  $: feature = $feature_info[pd.feature];

  $: x =
    feature.kind === 'quantitative'
      ? scaleLinear()
          .domain([Math.min(...pd.x_values), Math.max(...pd.x_values)])
          .range([marginLeft, width - marginRight])
      : scalePoint<number>()
          .domain(pd.x_values)
          .range([marginLeft, width - marginRight])
          .padding(0.5);

  $: y = scaleLinear()
    .domain($pdExtentNice)
    .range([height - marginBottom, marginTop]);

  $: xPixelCoordinates = pd.x_values.map((d) => x(d) ?? 0);

  $: line = d3line<{ x: number; y: number; drawn: boolean }>()
    .x((d) => x(d.x) ?? 0)
    .y((d) => y(d.y))
    .defined((d) => d.drawn);

  $: radius =
    'bandwidth' in x && !feature.ordered
      ? Math.max(2, Math.min(8, x.step() / 2))
      : 3;

  function draw(event: { buttons: number; offsetX: number; offsetY: number }) {
    if (event.buttons !== 1) {
      return;
    }

    const copyDrawnPds = { ...$drawn_pds };
    const copyPoints = [...copyDrawnPds[pd.feature]];

    const index = bisectCenter(xPixelCoordinates, event.offsetX);
    const dataY = y.invert(event.offsetY);

    copyPoints[index] = { x: copyPoints[index].x, y: dataY, drawn: true };

    $drawn_pds[pd.feature];

    copyDrawnPds[pd.feature] = copyPoints;
    $drawn_pds = copyDrawnPds;
  }
</script>

<svg {width} {height}>
  <rect {width} {height} rx={6} ry={6} fill="white" />

  <XAxis
    scale={x}
    y={height - marginBottom}
    label={pd.feature}
    gridHeight={-(height - marginBottom - marginTop)}
    integerOnly={feature.subkind === 'discrete'}
    value_map={'value_map' in feature ? feature.value_map : {}}
    tickColor={'#f3f4f6'}
  />
  <YAxis
    scale={y}
    x={marginLeft}
    label={$model_output_short}
    gridWidth={width - marginLeft - marginRight}
    tickColor={'#f3f4f6'}
  />

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
      {#each $drawn_pds[pd.feature] as d}
        {#if d.drawn}
          <circle
            cx={x(d.x)}
            cy={y(d.y)}
            r={radius}
            fill="steelblue"
            pointer-events="none"
          />
        {/if}
      {/each}
    </g>

    {#if feature.ordered}
      <path
        d={line($drawn_pds[pd.feature])}
        fill="none"
        stroke="steelblue"
        pointer-events="none"
      />
    {/if}
  </g>
</svg>
