<script lang="ts">
  import {
    selected_features,
    nextButtonEnabled,
    feature_info,
    feature_importances,
  } from '../stores';
  import { scaleLinear } from 'd3-scale';
  import { ascending } from 'd3-array';

  $nextButtonEnabled = true;

  $: maxScore = Math.max(
    ...Object.values($feature_importances).map((d) => d.score)
  );

  $: topFeatures = Object.entries($feature_importances)
    .map(([feature, { rank, score }]) => ({ feature, rank, score }))
    .sort((a, b) => ascending(a.rank, b.rank))
    .slice(0, 10);

  $: importanceWidth = scaleLinear().domain([0, maxScore]).range([0, 100]);
</script>

<div class="tw-flex tw-h-full tw-w-full tw-flex-col tw-items-center tw-gap-8">
  <div
    class="tw-flex tw-min-h-0 tw-flex-initial tw-flex-col tw-items-center tw-gap-4"
  >
    <p class="tw-w-128 tw-flex-none">
      The table below shows the features that you indicated are most important.
      Each feature has a score for how important it is to the model and its rank
      according to that score.
    </p>
    <div class="tw-overflow-auto tw-rounded-md tw-bg-white tw-px-2 tw-pb-2">
      <table class="tw-table-fixed">
        <thead>
          <tr class="tw-sticky tw-top-0 tw-bg-white">
            <th scope="col" class="tw-px-2 tw-pt-2 tw-font-normal tw-uppercase"
              >Feature</th
            >
            <th
              scope="col"
              class="tw-px-2 tw-pt-2 tw-text-right tw-font-normal tw-uppercase tw-tabular-nums"
              >Your Rank</th
            >
            <th
              scope="col"
              class="tw-px-2 tw-pt-2 tw-text-right tw-font-normal tw-uppercase tw-tabular-nums"
              >Model's Rank</th
            >
            <th
              scope="col"
              class="tw-w-36 tw-px-2 tw-pt-2 tw-font-normal tw-uppercase"
              >Model's Score</th
            >
          </tr>
        </thead>
        <tbody>
          {#each $selected_features as feature, i}
            {@const info = $feature_info[feature]}
            {@const importance = $feature_importances[feature]}
            <tr>
              <td class="tw-px-2">{info.display}</td>
              <td class="tw-px-2 tw-text-right tw-tabular-nums">{i + 1}</td>
              <td class="tw-px-2 tw-text-right tw-tabular-nums"
                >{importance.rank}</td
              >
              <td class="tw-px-2">
                <div
                  style:width="{importanceWidth(importance.score)}%"
                  class="tw-h-4 tw-bg-gray-500"
                />
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <div
    class="tw-flex tw-min-h-0 tw-flex-initial tw-flex-col tw-items-center tw-gap-4"
  >
    <p class="tw-w-128 tw-flex-none">
      This table shows the features ranked by their importance to the model.
    </p>
    <div class="tw-overflow-auto tw-rounded-md tw-bg-white tw-px-2 tw-pb-2">
      <table class="tw-table-fixed">
        <thead>
          <tr class="tw-sticky tw-top-0 tw-bg-white">
            <th
              scope="col"
              class="tw-px-2 tw-pt-2 tw-text-right tw-font-normal tw-uppercase tw-tabular-nums"
              >Model's Rank</th
            >
            <th scope="col" class="tw-px-2 tw-pt-2 tw-font-normal tw-uppercase"
              >Feature</th
            >
            <th
              scope="col"
              class="tw-w-36 tw-px-2 tw-pt-2 tw-font-normal tw-uppercase"
              >Model's Score</th
            >
          </tr>
        </thead>
        <tbody>
          {#each topFeatures as { rank, feature, score }}
            {@const info = $feature_info[feature]}
            <tr>
              <td class="tw-px-2 tw-text-right tw-tabular-nums">{rank}</td>
              <td class="tw-px-2">{info.display}</td>
              <td class="tw-px-2">
                <div
                  style:width="{importanceWidth(score)}%"
                  class="tw-h-4 tw-bg-gray-500"
                />
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
