<script lang="ts">
  import { selectedFeatures, pageIndex, pds, drawnPDPs } from '../stores';
  import FeedbackPDP from './FeedbackPDP.svelte';
</script>

<div class="tw-flex tw-h-full tw-w-full tw-justify-center tw-bg-gray-100">
  <div class="tw-flex tw-flex-col tw-gap-10">
    <div class="">Here's how you compare to the model.</div>
    <div class="tw-flex tw-flex-col">
      {#each $selectedFeatures as feature_name}
        <div class="">
          <div>{feature_name}</div>
          <FeedbackPDP
            pd={$pds[feature_name]}
            drawn={$drawnPDPs[feature_name]}
          />
        </div>
      {/each}
    </div>
    <div class="tw-ml-auto">
      <button
        disabled={$selectedFeatures.length === 0}
        on:click={() => ($pageIndex = $pageIndex + 1)}>Next</button
      >
    </div>
  </div>
</div>
