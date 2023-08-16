<script lang="ts">
  import { onDestroy } from 'svelte';
  import SegmentedButton from '../components/SegmentedButton.svelte';
  import {
    feature_names,
    selectedFeatures,
    nextButtonEnabled,
    feature_info,
    model_output_short,
    constraints,
  } from '../stores';
  import type { FeatureInfo } from '../types';

  $nextButtonEnabled = true;

  let searchValue = '';

  const segments = [
    { value: 'increasing', label: 'Increasing', enabled: true },
    { value: 'decreasing', label: 'Decreasing', enabled: true },
  ];

  $: orderedFeatures = [
    ...$selectedFeatures,
    ...$feature_names.filter((f) => !$selectedFeatures.includes(f)),
  ].filter((f) => $feature_info[f].ordered);

  const values: Record<string, '' | 'increasing' | 'decreasing'> =
    Object.fromEntries($feature_names.map((f) => [f, '']));

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
      class="tw-grid tw-flex-1 tw-auto-rows-min tw-grid-cols-[144px_1fr_max-content] tw-items-center tw-gap-2 tw-overflow-auto"
    >
      {#each orderedFeatures as feature}
        {@const info = $feature_info[feature]}
        {#if matchesSearch(info, searchValue)}
          <div class="tw-truncate">{info.display}</div>
          <div>{info.description}</div>
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
