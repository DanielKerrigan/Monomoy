<script lang="ts">
  import {
    selectedFeatures,
    pds,
    drawnPDPs,
    nextButtonEnabled,
  } from '../stores';
  import FeedbackPDP from './FeedbackPDP.svelte';

  let contentRect: DOMRectReadOnly | undefined;
  $: height = contentRect?.height ?? 0;
  $: width = contentRect?.width ?? 0;

  $: $nextButtonEnabled =
    Object.keys($drawnPDPs).length === $selectedFeatures.length;
</script>

<div class="tw-flex tw-h-full tw-w-full tw-flex-col tw-items-center tw-gap-8">
  <p class="tw-w-128">
    Here is how your expected relationships compare to the model's
    relationships.
  </p>
  <div
    class="tw-w-full tw-max-w-lg tw-flex-1 tw-space-y-4 tw-overflow-auto"
    bind:contentRect
  >
    {#each $selectedFeatures as feature_name}
      <FeedbackPDP
        pd={$pds[feature_name]}
        drawn={$drawnPDPs[feature_name]}
        {width}
        {height}
      />
    {/each}
  </div>
</div>
