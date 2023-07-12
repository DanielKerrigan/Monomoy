<script lang="ts">
  import { selectedFeatures, pageIndex, pds } from '../stores';
  import DrawingPDP from './DrawingPDP.svelte';
</script>

<div class="tw-flex tw-h-full tw-w-full tw-justify-center tw-bg-gray-100">
  <div class="tw-flex tw-flex-col tw-gap-10">
    <div class="">
      Draw the relationship between each feature and the model's output.
    </div>
    <div class="tw-flex tw-flex-col">
      {#each $selectedFeatures as feature_name}
        <div class="">
          <div>{feature_name}</div>
          <DrawingPDP pd={$pds[feature_name]} />
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
