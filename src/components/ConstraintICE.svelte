<script lang="ts">
  import { min, max } from 'd3-array';
  import { scaleLinear, scaleOrdinal, scalePoint, scaleBand } from 'd3-scale';
  import type { ScaleBand } from 'd3-scale';
  import type { Line } from 'd3-shape';
  import { line as d3line } from 'd3-shape';
  import XAxis from './XAxis.svelte';
  import YAxis from './YAxis.svelte';
  import { ices, feature_info, model_output_short } from '../stores';
  import { categoricalColors, centerIceLines, scaleCanvas } from '../vis-utils';
  import { onMount } from 'svelte';
  import type { ConstraintFeedback } from '../types';

  export let constraint: ConstraintFeedback;
  export let indices: Set<number> | null = null;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  $: feature = $feature_info[constraint.feature];
  $: ice = centerIceLines($ices[constraint.feature]);

  // margin.top is space above each individual plot
  const margin = {
    top: 14,
    right: 10,
    bottom: 32,
    left: 50,
  };

  type Key = 'satisfies' | 'unsatisfies';

  let borderBoxSize: ResizeObserverSize[] | undefined | null;

  let originalSections: { key: Key; indices: number[] }[] = [];

  $: originalSections = [
    { key: 'satisfies' as const, indices: constraint.satisfies },
    { key: 'unsatisfies' as const, indices: constraint.unsatisfies },
  ].filter((d) => d.indices.length > 0);

  $: keys = originalSections.map((d) => d.key);

  $: sections = originalSections.map((d) => ({
    key: d.key,
    indices: d.indices.filter((i) => indices === null || indices.has(i)),
  }));

  $: chartHeight = borderBoxSize ? borderBoxSize[0].blockSize : 0;
  $: width = borderBoxSize ? borderBoxSize[0].inlineSize : 0;

  $: fy = scaleBand<string>().domain(keys).range([0, chartHeight]);

  $: facetHeight = fy.bandwidth();

  $: x =
    feature.kind === 'quantitative'
      ? scaleLinear()
          .domain([
            feature.values[0],
            feature.values[feature.values.length - 1],
          ])
          .range([margin.left, width - margin.right])
      : scalePoint<number>()
          .domain(feature.values)
          .range([margin.left, width - margin.right])
          .padding(0.5);

  $: minY = min(ice, (line) => min(line)) ?? 0;
  $: maxY = max(ice, (line) => max(line)) ?? 0;

  $: y = scaleLinear()
    .domain([minY, maxY])
    .nice()
    .range([facetHeight - margin.bottom, margin.top]);

  $: medium = scaleOrdinal<Key, string>()
    .domain(['satisfies', 'unsatisfies'])
    .range(categoricalColors.medium);

  $: dark = scaleOrdinal<Key, string>()
    .domain(['satisfies', 'unsatisfies'])
    .range(categoricalColors.dark);

  $: line = d3line<number>()
    .x((_, i) => x(feature.values[i]) ?? 0)
    .y((d) => y(d))
    .context(ctx);

  // canvas

  onMount(() => {
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  });

  function drawClusterLines(
    iceLines: number[][],
    sections: { key: Key; indices: number[] }[],
    ctx: CanvasRenderingContext2D,
    line: Line<number>,
    fy: ScaleBand<string>,
    width: number,
    height: number
  ) {
    // TODO: is this check needed?
    if (
      ctx === null ||
      ctx === undefined ||
      line === null ||
      line === undefined
    ) {
      return;
    }
    ctx.save();

    ctx.clearRect(0, 0, width, height);

    sections.forEach((section) => {
      ctx.translate(0, fy(section.key) ?? 0);

      // cluster ice lines

      ctx.lineWidth = 1.0;
      ctx.globalAlpha = 0.25;

      section.indices.forEach((idx) => {
        ctx.beginPath();
        ctx.strokeStyle = medium(section.key);
        line(iceLines[idx]);
        ctx.stroke();
      });

      // undo translate
      ctx.translate(0, -(fy(section.key) ?? 0));
    });

    ctx.restore();
  }

  /*
    TODO: is this true in this case?
    If scaleCanvas is called after drawLines, then it will clear the canvas.
    We need the draw function so that the reactive statement for scaleCanvas is
    not dependent on pd or line.
    */
  function draw() {
    drawClusterLines(ice, sections, ctx, line, fy, width, chartHeight);
  }

  $: if (ctx) {
    scaleCanvas(canvas, ctx, width, chartHeight);
    draw();
  }

  $: drawClusterLines(ice, sections, ctx, line, fy, width, chartHeight);
</script>

<div class="cluster-lines-container">
  <div class="cluster-lines-chart" bind:borderBoxSize>
    <canvas bind:this={canvas} />
    <svg class="svg-for-clusters" height={chartHeight} {width}>
      {#each sections as section, i}
        <g transform="translate(0,{fy(section.key) ?? 0})">
          <text
            dominant-baseline="middle"
            text-anchor="end"
            font-size="12"
            x={width - margin.right}
            y={margin.top / 2}
          >
            <tspan>{section.indices.length} instances</tspan>
            <tspan fill={dark(section.key)} font-weight="bold"
              >{section.key === 'unsatisfies' ? 'do not' : ''} satisfy the constraint</tspan
            >
          </text>
          <YAxis
            scale={y}
            x={margin.left}
            label={`relative ${$model_output_short}`}
          />
          <XAxis
            scale={x}
            y={facetHeight - margin.bottom}
            showTickLabels={i === sections.length - 1}
            showAxisLabel={i === sections.length - 1}
            label={feature.display}
            integerOnly={feature.subkind === 'discrete'}
            value_map={'value_map' in feature ? feature.value_map : {}}
          />
        </g>
      {/each}
    </svg>
  </div>
</div>

<style>
  .cluster-lines-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .cluster-lines-chart {
    position: relative;
    width: 100%;
    flex: 1;
  }

  .svg-for-clusters,
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
