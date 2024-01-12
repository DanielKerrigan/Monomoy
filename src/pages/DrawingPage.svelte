<script lang="ts">
  import {
    selected_features,
    pds,
    drawn_pds,
    model_output_long,
    pdExtentNice,
    feature_info,
    progress,
    feature_names,
  } from '../stores';
  import DrawingPDP from '../components/DrawingPDP.svelte';
  import Sparkline from '../components/Sparkline.svelte';
  import { areArraysEqual } from '../utils';

  $: ({ step, part } = progress);

  let contentRect: DOMRectReadOnly | undefined;
  $: height = contentRect?.height ?? 0;
  $: width = contentRect?.width ?? 0;

  let currentFeature = $selected_features[0];

  $: isDrawn = Object.fromEntries(
    $selected_features.map((f) => [f, $drawn_pds[f].every((d) => d.drawn)])
  );

  $: step.setComplete($selected_features.every((f) => isDrawn[f]));

  let initial = { ...$drawn_pds };
  let changedSinceInitial = false;

  $: if (
    !changedSinceInitial &&
    $feature_names.some(
      (f) => !areArraysEqual(initial[f], $drawn_pds[f], (a, b) => a.y === b.y)
    )
  ) {
    changedSinceInitial = true;
    part.setNextStepsIncomplete();
    step.setComplete($selected_features.every((f) => isDrawn[f]));
  }
</script>

<div class="tw-flex tw-h-full tw-w-full tw-flex-col tw-items-center tw-gap-8">
  <p class="tw-w-128">
    For each feature, draw a chart that shows what you expect the average
    relationship to be between the values of the feature and {$model_output_long}.
  </p>
  <div class="tw-flex tw-w-full tw-flex-1 tw-gap-16">
    <div class="tw-w-80 tw-rounded-md tw-bg-white tw-p-4">
      {#each $selected_features as feature}
        <button
          class="tw-flex tw-w-full tw-items-center tw-justify-start tw-border-none tw-px-1 tw-text-black hover:tw-bg-indigo-100 active:tw-bg-indigo-200"
          class:tw-font-semibold={!isDrawn[feature]}
          class:tw-bg-indigo-100={feature === currentFeature}
          on:click={() => (currentFeature = feature)}
        >
          <div class="tw-truncate" title={$feature_info[feature].display}>
            {$feature_info[feature].display}
          </div>
          {#if isDrawn[feature]}
            <div class="tw-ml-auto tw-flex-none">
              <Sparkline
                lines={[$drawn_pds[feature]]}
                yDomain={$pdExtentNice}
                showCircles={!$feature_info[feature].ordered}
                showLine={$feature_info[feature].ordered}
                xScaleType={$feature_info[feature].kind === 'categorical'
                  ? 'point'
                  : 'linear'}
              />
            </div>
          {/if}
        </button>
      {/each}
    </div>
    <div class="tw-flex-1 tw-rounded-md" bind:contentRect>
      <DrawingPDP pd={$pds[currentFeature]} {width} {height} />
    </div>
  </div>
</div>
