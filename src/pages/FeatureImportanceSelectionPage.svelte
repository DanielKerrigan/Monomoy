<script lang="ts">
  import {
    feature_names,
    selected_features,
    nextButtonEnabled,
    model_output_long,
    feature_info,
  } from '../stores';
  import type { FeatureInfo } from '../types';

  let searchValue = '';

  $: $nextButtonEnabled = $selected_features.length > 0;

  function addFeature(feature: string) {
    $selected_features = [...$selected_features, feature];
  }

  function removeFeature(idx: number) {
    const selected = $selected_features.slice();
    selected.splice(idx, 1);
    $selected_features = selected;
  }

  function reorderFeature(feature: string, oldIdx: number, newIdx: number) {
    const selected = $selected_features.slice();
    const swappedFeature = selected[newIdx];
    selected[newIdx] = feature;
    selected[oldIdx] = swappedFeature;
    $selected_features = selected;
  }

  function matchesSearch(info: FeatureInfo, searchValue: string): boolean {
    const searchLower = searchValue.toLowerCase();
    return (
      info.display.toLowerCase().includes(searchLower) ||
      info.description.toLowerCase().includes(searchLower)
    );
  }
</script>

<div class="tw-flex tw-h-full tw-w-full tw-flex-col tw-items-center tw-gap-8">
  <p class="tw-w-128">
    Each data point contains {$feature_names.length} features that are listed below
    on the left. Select and rank the features that you think are most important for
    predicting {$model_output_long}.
  </p>

  <div class="tw-flex tw-min-h-0 tw-w-full tw-flex-1 tw-gap-16">
    <div
      class="tw-flex tw-flex-1 tw-flex-col tw-gap-4 tw-rounded-lg tw-bg-white tw-p-4"
    >
      <div class="tw-flex tw-items-center tw-gap-1">
        <label for="monomoy-feature-search">Search</label>
        <input
          class="tw-w-0 tw-flex-1 tw-rounded-md tw-border tw-border-gray-400 tw-px-2 tw-py-1 focus:tw-border-indigo-500 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-indigo-500"
          id="monomoy-feature-search"
          bind:value={searchValue}
        />
      </div>
      <div
        class="tw-grid tw-flex-1 tw-auto-rows-min tw-grid-cols-[20px_144px_1fr] tw-items-center tw-gap-x-2 tw-overflow-auto"
      >
        {#each $feature_names as feature}
          {@const info = $feature_info[feature]}
          {#if matchesSearch(info, searchValue)}
            <button
              class="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border-none tw-text-black hover:tw-bg-indigo-100 active:tw-bg-indigo-200 disabled:tw-cursor-not-allowed disabled:tw-text-gray-300 hover:disabled:tw-bg-transparent"
              disabled={$selected_features.includes(feature)}
              on:click={() => addFeature(feature)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="tw-h-5 tw-w-5"
              >
                <path
                  d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
                />
              </svg>
            </button>
            <div class="tw-truncate">{info.display}</div>
            <div>{info.description}</div>
          {/if}
        {/each}
      </div>
    </div>

    <div class="tw-flex tw-w-80 tw-flex-col tw-rounded-lg tw-bg-white tw-p-4">
      <div>
        {#each $selected_features as feature, i (feature)}
          <div class="tw-flex tw-items-center tw-justify-start">
            <div>{i + 1}.</div>
            <div class="tw-ml-1 tw-truncate">
              {$feature_info[feature].display}
            </div>

            <button
              class="tw-ml-auto tw-flex tw-flex-none tw-items-center tw-justify-center tw-rounded-full tw-border-none tw-text-black hover:tw-bg-indigo-100 active:tw-bg-indigo-200 disabled:tw-cursor-not-allowed disabled:tw-text-gray-300 hover:disabled:tw-bg-transparent"
              disabled={i === 0}
              on:click={() => reorderFeature(feature, i, i - 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="tw-h-5 tw-w-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <button
              class="tw-flex tw-flex-none tw-items-center tw-justify-center tw-rounded-full tw-border-none tw-text-black hover:tw-bg-indigo-100 active:tw-bg-indigo-200 disabled:tw-cursor-not-allowed disabled:tw-text-gray-300 hover:disabled:tw-bg-transparent"
              disabled={i === $selected_features.length - 1}
              on:click={() => reorderFeature(feature, i, i + 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="tw-h-5 tw-w-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <button
              class="tw-ml-2 tw-flex tw-flex-none tw-items-center tw-justify-center tw-rounded-full tw-border-none tw-text-black hover:tw-bg-indigo-100 active:tw-bg-indigo-200"
              on:click={() => removeFeature(i)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="tw-h-5 tw-w-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
