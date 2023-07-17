<script lang="ts">
  import { pageIndex, nextButtonEnabled } from '../stores';
  import { range } from 'd3-array';
  import { scalePoint } from 'd3-scale';

  export let numSteps: number;

  let contentRect: DOMRectReadOnly | undefined;
  $: width = contentRect?.width ?? 0;

  $: steps = range(numSteps);
  $: x = scalePoint<number>().domain(steps).range([0, width]).padding(0.5);

  const bigR = 5;
  const smallR = 3;
</script>

<div class="tw-flex tw-items-center">
  <svg class="tw-min-w-0 tw-flex-1" height={bigR * 2} bind:contentRect>
    <g>
      {#each steps as step}
        <circle
          cx={x(step)}
          cy={bigR}
          r={step === $pageIndex ? bigR : smallR}
          class={step <= $pageIndex ? 'tw-fill-indigo-600' : 'tw-fill-gray-400'}
        />
      {/each}
    </g>
  </svg>
  <button
    disabled={!$nextButtonEnabled}
    on:click={() => ($pageIndex = $pageIndex + 1)}
    class="tw-rounded-md tw-bg-indigo-600 tw-px-2 tw-py-1 tw-text-white hover:tw-bg-indigo-700 active:tw-bg-indigo-800 disabled:tw-cursor-not-allowed disabled:tw-bg-gray-300"
    >Next</button
  >
</div>
