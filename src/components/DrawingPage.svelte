<script lang="ts">
  import {
    selectedFeatures,
    pds,
    drawnPDPs,
    nextButtonEnabled,
    model_output_long,
  } from '../stores';
  import DrawingPDP from './DrawingPDP.svelte';

  let contentRect: DOMRectReadOnly | undefined;
  $: height = contentRect?.height ?? 0;
  $: width = contentRect?.width ?? 0;

  $: $nextButtonEnabled =
    Object.keys($drawnPDPs).length === $selectedFeatures.length;
</script>

<div class="tw-flex tw-h-full tw-w-full tw-flex-col tw-items-center tw-gap-8">
  <p class="tw-w-128">
    For each feature, draw a line chart that shows what you expect the
    relationship to be between the values of the feature and {$model_output_long}.
  </p>
  <div
    class="tw-w-full tw-max-w-lg tw-flex-1 tw-space-y-4 tw-overflow-auto"
    bind:contentRect
  >
    {#each $selectedFeatures as feature_name}
      <DrawingPDP pd={$pds[feature_name]} {width} {height} />
    {/each}
  </div>
</div>
