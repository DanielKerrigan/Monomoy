<script lang="ts">
  import { scaleLinear, scalePoint } from 'd3-scale';
  import { line as d3line } from 'd3-shape';

  export let lines: { x: number; y: number }[][];
  export let width = 48;
  export let height = 24;
  export let yDomain: [number, number];
  export let showLine: boolean;
  export let showCircles: boolean;
  export let xScaleType: 'linear' | 'point';
  export let colors = ['#155392', '#e65201'];

  const marginTop = 2;
  const marginRight = 2;
  const marginBottom = 2;
  const marginLeft = 2;

  $: x =
    xScaleType === 'linear'
      ? scaleLinear()
          .domain([lines[0][0].x, lines[0][lines[0].length - 1].x])
          .range([marginLeft, width - marginRight])
      : scalePoint<number>()
          .domain(lines[0].map((v) => v.x))
          .range([marginLeft, width - marginRight])
          .padding(0.5);

  $: y = scaleLinear()
    .domain(yDomain)
    .range([height - marginBottom, marginTop]);

  $: line = d3line<{ x: number; y: number }>()
    .x((d) => x(d.x) ?? 0)
    .y((d) => y(d.y));
</script>

<svg {width} {height}>
  {#each lines as values, i}
    {#if showCircles}
      <g>
        {#each values as v}
          <circle
            cx={x(v.x)}
            cy={y(v.y)}
            r="2"
            fill={lines.length === 1 ? colors[i] : 'none'}
            stroke={lines.length === 1 ? 'none' : colors[i]}
            pointer-events="none"
          />
        {/each}
      </g>
    {/if}

    {#if showLine}
      <path
        d={line(values)}
        fill="none"
        stroke={colors[i]}
        pointer-events="none"
      />
    {/if}
  {/each}
</svg>
