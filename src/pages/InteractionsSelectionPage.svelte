<script lang="ts">
  import { onDestroy } from 'svelte';
  import {
    selected_features,
    feature_info,
    progress,
    feature_trends,
    drawn_pds,
  } from '../stores';
  import { schemeTableau10 } from 'd3-scale-chromatic';
  import DrawingMultiple from '../components/DrawingMultiple.svelte';

  let contentRect: DOMRectReadOnly | undefined;
  $: height = contentRect?.height ?? 0;
  $: width = contentRect?.width ?? 0;

  let currentFeature = $selected_features[0];
  let currentTrendId = -1;

  let { step } = progress;
  step.setComplete(true);

  let isViewed = Object.fromEntries(
    $selected_features.map((feature) => [
      feature,
      $step.complete || feature === currentFeature,
    ])
  );

  $: step.setComplete($selected_features.every((feature) => isViewed[feature]));
  $: usedColors = new Set(
    $feature_trends[currentFeature].map((trend) => trend.color)
  );

  function onChangeFeature() {
    isViewed[currentFeature] = true;
  }

  function createNewSubset() {
    const color =
      schemeTableau10.find((color) => !usedColors.has(color)) ?? 'white';

    const newSubset = {
      id: $feature_trends[currentFeature].length,
      color,
      drawing: $drawn_pds[currentFeature].map((d) => ({
        x: d.x,
        y: d.y,
        drawn: false,
      })),
    };

    currentTrendId = newSubset.id;
    $feature_trends[currentFeature].push(newSubset);
    $feature_trends = $feature_trends;
  }

  onDestroy(() => {
    0;
  });
</script>

<div class="tw-flex tw-h-full tw-w-full tw-flex-col tw-items-center tw-gap-8">
  <p class="tw-w-128">
    For each feature, are there any subsets of the data that you expect to have
    a trend that differs from the average relationship that you drew previously?
  </p>

  <div
    class="tw-flex tw-min-h-0 tw-w-full tw-flex-1 tw-flex-col tw-gap-4 tw-rounded-lg tw-bg-white tw-p-4"
  >
    <div class="tw-flex tw-items-center tw-gap-4">
      <div class="tw-flex tw-items-center tw-gap-1">
        <label for="monomoy-feature-select">Feature</label>
        <select
          bind:value={currentFeature}
          on:change={onChangeFeature}
          id="monomoy-feature-select"
          class="tw-border tw-border-gray-400 focus:tw-border-indigo-500 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-indigo-500"
        >
          {#each $selected_features as feature}
            <option value={feature}>{$feature_info[feature].display}</option>
          {/each}
        </select>
      </div>
    </div>
    <div class="tw-flex tw-flex-1 tw-gap-4">
      <div class="tw-flex-1 tw-rounded-md" bind:contentRect>
        <DrawingMultiple
          feature={currentFeature}
          {currentTrendId}
          {width}
          {height}
        />
      </div>

      <div
        class="tw-flex tw-w-48 tw-flex-none tw-select-none tw-flex-col tw-rounded-md"
      >
        <div class="tw-flex tw-items-center">
          <div class="tw-text-lg">Trends</div>
          <button
            class="tw-ml-auto tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border-none tw-text-black hover:tw-bg-indigo-100 active:tw-bg-indigo-200 disabled:tw-cursor-not-allowed disabled:tw-text-gray-300 hover:disabled:tw-bg-transparent"
            disabled={$feature_trends[currentFeature].length >=
              schemeTableau10.length}
            on:click={createNewSubset}
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
        </div>

        {#if $feature_trends[currentFeature].length > 0}
          {#each $feature_trends[currentFeature] as trend}
            <div
              class="tw-flex tw-items-center hover:tw-bg-indigo-100 active:tw-bg-indigo-200"
              class:tw-bg-indigo-100={currentTrendId === trend.id}
            >
              <button
                on:click={() => (currentTrendId = trend.id)}
                class="tw-flex tw-items-center tw-gap-1"
              >
                <svg class="tw-h-3 tw-w-3">
                  <rect class="tw-h-3 tw-w-3" fill={trend.color} />
                </svg>
                <span>Trend {trend.id}</span>
              </button>
            </div>
          {/each}
        {:else}
          <div>No different trends.</div>
        {/if}
      </div>
    </div>
  </div>
</div>
