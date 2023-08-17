<script lang="ts">
  import { onDestroy } from 'svelte';
  import SegmentedButton from '../components/SegmentedButton.svelte';
  import {
    feature_names,
    selected_features,
    nextButtonEnabled,
    feature_info,
    model_output_short,
    constraints,
    drawn_pds,
    pdExtentNice,
  } from '../stores';
  import type { FeatureInfo } from '../types';
  import { pairs } from 'd3-array';
  import Sparkline from '../components/Sparkline.svelte';

  $nextButtonEnabled = true;

  let searchValue = '';

  const segments = [
    { value: 'increasing', label: 'Increasing', enabled: true },
    { value: 'decreasing', label: 'Decreasing', enabled: true },
  ];

  $: orderedFeatures = [
    ...$selected_features,
    ...$feature_names.filter((f) => !$selected_features.includes(f)),
  ].filter((f) => $feature_info[f].ordered);

  let values: Record<string, '' | 'increasing' | 'decreasing'>;
  $: values = Object.fromEntries(
    orderedFeatures.map((f) => {
      if (!$selected_features.includes(f)) {
        return [f, ''];
      }

      const pd = $drawn_pds[f].map((d) => d.y);
      const diff = pairs(pd, (a, b) => b - a);

      const increasing = diff.every((d) => d >= 0);
      const decreasing = diff.every((d) => d <= 0);

      const direction = increasing
        ? 'increasing'
        : decreasing
        ? 'decreasing'
        : '';

      return [f, direction];
    })
  );

  function matchesSearch(info: FeatureInfo, searchValue: string): boolean {
    const searchLower = searchValue.toLowerCase();
    return (
      info.display.toLowerCase().includes(searchLower) ||
      info.description.toLowerCase().includes(searchLower)
    );
  }

  onDestroy(() => {
    $constraints = { ...values };
  });
</script>

<div class="tw-flex tw-h-full tw-w-full tw-flex-col tw-items-center tw-gap-8">
  <p class="tw-w-128">
    Are there any features that you expect to have a monotonically increasing or
    decreasing relationship with {$model_output_short}?
  </p>

  <div
    class="tw-flex tw-min-h-0 tw-w-full tw-flex-1 tw-flex-col tw-gap-4 tw-rounded-lg tw-bg-white tw-p-4"
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
      class="tw-grid tw-flex-1 tw-auto-rows-min tw-grid-cols-[144px_1fr_48px_max-content] tw-items-center tw-gap-2 tw-overflow-auto"
    >
      {#each orderedFeatures as feature}
        {@const info = $feature_info[feature]}
        {#if matchesSearch(info, searchValue)}
          <div class="tw-truncate" title={info.display}>{info.display}</div>
          <div>{info.description}</div>
          <div>
            {#if $selected_features.includes(feature)}
              <Sparkline
                lines={[$drawn_pds[feature]]}
                yDomain={$pdExtentNice}
                showCircles={false}
                showLine={true}
                xScaleType={$feature_info[feature].kind === 'categorical'
                  ? 'point'
                  : 'linear'}
              />
            {/if}
          </div>
          <SegmentedButton
            bind:selectedValue={values[feature]}
            {segments}
            allowUnselected={true}
          />
        {/if}
      {/each}
    </div>
  </div>
</div>
