<script lang="ts">
  import { feature_names, selectedFeatures, pageIndex } from '../stores';

  function selectFeature(feature_name: string) {
    $selectedFeatures = [...$selectedFeatures, feature_name];
  }
</script>

<div class="tw-flex tw-h-full tw-w-full tw-justify-center tw-bg-gray-100">
  <div class="tw-flex tw-flex-col tw-gap-10">
    <div class="">
      Select and rank the most important features in the model.
    </div>
    <div class="tw-flex tw-gap-10">
      <div class="tw-flex tw-flex-1 tw-flex-col tw-border-r-2 tw-bg-white">
        {#each $feature_names as feature_name}
          <div class="tw-flex tw-items-center tw-justify-start ">
            <button
              class="tw-flex tw-items-center tw-justify-center tw-border-none tw-bg-white tw-text-black"
              on:click={() => selectFeature(feature_name)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="tw-h-6 tw-w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
            <div>{feature_name}</div>
          </div>
        {/each}
      </div>
      <div class="tw-flex tw-flex-1 tw-flex-col tw-border-r-2 tw-bg-white">
        {#each $selectedFeatures as feature_name}
          <div class="tw-flex tw-items-center tw-justify-start">
            <div>{feature_name}</div>
          </div>
        {/each}
      </div>
    </div>
    <div class="tw-ml-auto">
      <button
        disabled={$selectedFeatures.length === 0}
        on:click={() => ($pageIndex = $pageIndex + 1)}>Next</button
      >
    </div>
  </div>
</div>
