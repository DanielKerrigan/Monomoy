<script lang="ts">
  import XAxis from './XAxis.svelte';
  import YAxis from './YAxis.svelte';
  import { scaleLinear, scalePoint } from 'd3-scale';
  import { bisectCenter } from 'd3-array';
  import { line as d3line } from 'd3-shape';
  import {
    drawn_pds,
    feature_info,
    feature_trends,
    model_output_short,
    pdExtentNice,
    pds,
  } from '../stores';
  import type { Trend } from '../types';

  export let feature: string;
  export let currentTrendId: number;
  export let width = 300;
  export let height = 200;

  const marginTop = 12;
  const marginRight = 24;
  const marginBottom = 32;
  const marginLeft = 56;

  let trends: Trend[];
  $: trends = $feature_trends[feature];

  let currentTrend: Trend | undefined = undefined;
  $: currentTrend = trends.find((d) => d.id === currentTrendId);

  $: pd = $pds[feature];
  $: average = $drawn_pds[feature];

  $: info = $feature_info[feature];

  $: x =
    info.kind === 'quantitative'
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
    'bandwidth' in x && !info.ordered
      ? Math.max(2, Math.min(8, x.step() / 2))
      : 3;

  function draw(event: { buttons: number; offsetX: number; offsetY: number }) {
    if (event.buttons !== 1 || !currentTrend) {
      return;
    }

    const copyPoints = [...currentTrend.drawing];

    const index = bisectCenter(xPixelCoordinates, event.offsetX);
    const dataY = y.invert(event.offsetY);

    copyPoints[index] = { x: copyPoints[index].x, y: dataY, drawn: true };

    currentTrend.drawing = copyPoints;
    $feature_trends = $feature_trends;
  }
</script>

<svg {width} {height}>
  <rect {width} {height} rx={6} ry={6} fill="white" />

  <XAxis
    scale={x}
    y={height - marginBottom}
    label={pd.feature}
    gridHeight={-(height - marginBottom - marginTop)}
    integerOnly={info.subkind === 'discrete'}
    value_map={'value_map' in info ? info.value_map : {}}
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
      {#if info.kind === 'categorical'}
        <g>
          {#each average as d}
            <circle
              cx={x(d.x)}
              cy={y(d.y)}
              r={radius / 2}
              fill={info.ordered ? 'black' : 'none'}
              stroke={info.ordered ? 'none' : 'black'}
              stroke-width={2}
              pointer-events="none"
            />
          {/each}
        </g>
      {/if}

      {#if info.ordered}
        <path
          d={line($drawn_pds[pd.feature])}
          fill="none"
          stroke="black"
          pointer-events="none"
        />
      {/if}
    </g>

    <g>
      {#each trends as trend}
        {@const isCurrent = trend.id === currentTrendId}
        <g>
          {#if info.kind === 'categorical' || isCurrent}
            <g>
              {#each trend.drawing as d}
                {#if d.drawn}
                  <circle
                    cx={x(d.x)}
                    cy={y(d.y)}
                    r={isCurrent ? radius : radius / 2}
                    fill={info.ordered ? trend.color : 'none'}
                    stroke={info.ordered ? 'none' : trend.color}
                    stroke-width={2}
                    pointer-events="none"
                  />
                {/if}
              {/each}
            </g>
          {/if}

          {#if info.ordered}
            <path
              d={line(trend.drawing)}
              fill="none"
              stroke={trend.color}
              stroke-width={isCurrent ? 2 : 1}
              pointer-events="none"
            />
          {/if}
        </g>
      {/each}
    </g>
  </g>
</svg>
