<script lang="ts">
  import XAxis from './XAxis.svelte';
  import YAxis from './YAxis.svelte';
  import { scaleLinear, scalePoint } from 'd3-scale';
  import { line as d3line } from 'd3-shape';
  import type { DrawnPD, OneWayPD } from '../types';
  import { model_output_short, feature_info, pdExtentNice } from '../stores';
  import { pdToXY } from '../vis-utils';

  export let pd: OneWayPD;
  export let drawn: DrawnPD;
  export let width = 300;
  export let height = 200;

  const marginTop = 12;
  const marginRight = 24;
  const marginBottom = 32;
  const marginLeft = 56;

  const userColor = '#155392';
  const modelColor = '#e65201';

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

  $: line = d3line<{ x: number; y: number }>()
    .x((d) => x(d.x) ?? 0)
    .y((d) => y(d.y));

  $: radius =
    'bandwidth' in x && !feature.ordered
      ? Math.max(2, Math.min(8, x.step() / 2))
      : 3;

  $: pdPoints = pdToXY(pd);
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

  <g>
    <g>
      {#if feature.kind === 'categorical'}
        {#each drawn as d}
          <circle
            cx={x(d.x)}
            cy={y(d.y)}
            r={radius}
            fill={feature.ordered ? userColor : 'none'}
            stroke={feature.ordered ? 'none' : userColor}
            stroke-width="2"
            pointer-events="none"
          />
        {/each}
      {/if}
    </g>

    {#if feature.ordered}
      <path
        d={line(drawn)}
        fill="none"
        stroke={userColor}
        stroke-width="2"
        pointer-events="none"
      />
    {/if}
  </g>

  <g>
    <g>
      {#if feature.kind === 'categorical'}
        {#each pdPoints as d}
          <circle
            cx={x(d.x)}
            cy={y(d.y)}
            r={radius}
            fill={feature.ordered ? modelColor : 'none'}
            stroke={feature.ordered ? 'none' : modelColor}
            stroke-width="2"
            pointer-events="none"
          />
        {/each}
      {/if}
    </g>

    {#if feature.ordered}
      <path
        d={line(pdPoints)}
        fill="none"
        stroke-width="2"
        stroke={modelColor}
        pointer-events="none"
      />
    {/if}
  </g>
</svg>
