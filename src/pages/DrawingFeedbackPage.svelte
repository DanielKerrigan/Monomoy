<script lang="ts">
  import {
    selected_features,
    pds,
    drawn_pds,
    nextButtonEnabled,
    pdExtentNice,
    feature_info,
    model_output_short,
  } from '../stores';
  import { pdToXY } from '../vis-utils';
  import FeedbackPDP from '../components/FeedbackPDP.svelte';
  import Sparkline from '../components/Sparkline.svelte';

  let contentRect: DOMRectReadOnly | undefined;
  $: height = contentRect?.height ?? 0;
  $: width = contentRect?.width ?? 0;

  let currentFeature = $selected_features[0];

  let isViewed = Object.fromEntries(
    $selected_features.map((f) => [f, f === currentFeature])
  );

  $: $nextButtonEnabled = $selected_features.every((f) => isViewed[f]);
</script>

<div class="tw-flex tw-h-full tw-w-full tw-flex-col tw-items-center tw-gap-8">
  <p class="tw-w-128">
    The below charts compare the relationships between the features and {$model_output_short}
    that <span class="tw-text-[#155392]">you drew</span>
    to the relationships
    <span class="tw-text-[#e65201]">learned by the model</span>.
  </p>
  <div class="tw-flex tw-w-full tw-flex-1 tw-gap-16">
    <div class="tw-w-80 tw-rounded-md tw-bg-white tw-p-4">
      {#each $selected_features as feature}
        <button
          class="tw-flex tw-w-full tw-items-center tw-justify-start tw-border-none tw-px-1 tw-text-black hover:tw-bg-indigo-100 active:tw-bg-indigo-200"
          class:tw-font-semibold={!isViewed[feature]}
          class:tw-bg-indigo-100={feature === currentFeature}
          on:click={() => {
            currentFeature = feature;
            isViewed[feature] = true;
          }}
        >
          <div class="tw-truncate" title={$feature_info[feature].display}>
            {$feature_info[feature].display}
          </div>
          <div class="tw-ml-auto tw-flex-none">
            <Sparkline
              lines={[$drawn_pds[feature], pdToXY($pds[feature])]}
              yDomain={$pdExtentNice}
              showCircles={!$feature_info[feature].ordered}
              showLine={$feature_info[feature].ordered}
              xScaleType={$feature_info[feature].kind === 'categorical'
                ? 'point'
                : 'linear'}
            />
          </div>
        </button>
      {/each}
    </div>
    <div class="tw-flex-1 tw-rounded-md" bind:contentRect>
      <FeedbackPDP
        pd={$pds[currentFeature]}
        drawn={$drawn_pds[currentFeature]}
        {width}
        {height}
      />
    </div>
  </div>
</div>
