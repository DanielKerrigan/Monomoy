<script lang="ts">
  import ConstraintICE from '../components/ConstraintICE.svelte';
  import ConstraintsDescriptions from '../components/ConstraintsDescriptions.svelte';
  import {
    feature_info,
    constraints_feedback,
    num_instances,
    progress,
  } from '../stores';

  let increasingConstraints = $constraints_feedback.filter(
    ({ direction }) => direction === 'increasing'
  );

  let decreasingConstraints = $constraints_feedback.filter(
    ({ direction }) => direction === 'decreasing'
  );

  let selectedConstraint =
    increasingConstraints.length > 0
      ? increasingConstraints[0]
      : decreasingConstraints[0];

  let { step } = progress;

  let isViewed = Object.fromEntries(
    $constraints_feedback.map(({ feature }) => [
      feature,
      $step.complete || feature === selectedConstraint.feature,
    ])
  );

  function onChangeFeature() {
    isViewed[selectedConstraint.feature] = true;
  }

  $: hasSatisfiedInstances = selectedConstraint.satisfies.length > 0;
  $: hasUnsatisfiedInstances = selectedConstraint.unsatisfies.length > 0;

  $: step.setComplete(
    $constraints_feedback.every(({ feature }) => isViewed[feature])
  );

  // distribution plot interaction

  let indices: number[] | null = null;

  function onFilterIndices(event: CustomEvent<number[]>) {
    indices = event.detail;
  }
</script>

<div class="tw-flex tw-h-full tw-w-full tw-flex-col tw-items-center tw-gap-8">
  <p class="tw-w-128">
    Below, you can review whether or not the monotonicity constraints that you
    specified are met by the model.
  </p>

  <div
    class="tw-flex tw-min-h-0 tw-w-full tw-flex-1 tw-flex-col tw-gap-4 tw-rounded-lg tw-bg-white tw-p-4"
  >
    <div class="tw-flex tw-items-center tw-gap-4">
      <div class="tw-flex tw-items-center tw-gap-1">
        <label for="monomoy-feature-select">Feature</label>
        <select
          bind:value={selectedConstraint}
          on:change={onChangeFeature}
          id="monomoy-feature-select"
          class="tw-border tw-border-gray-400 focus:tw-border-indigo-500 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-indigo-500"
        >
          {#if increasingConstraints.length > 0}
            <optgroup label="Increasing">
              {#each increasingConstraints as constraint}
                <option value={constraint}
                  >{$feature_info[constraint.feature].display}</option
                >
              {/each}
            </optgroup>
          {/if}
          {#if decreasingConstraints.length > 0}
            <optgroup label="Decreasing">
              {#each decreasingConstraints as constraint}
                <option value={constraint}
                  >{$feature_info[constraint.feature].display}</option
                >
              {/each}
            </optgroup>
          {/if}
        </select>
      </div>
      <div>
        {selectedConstraint.satisfies.length}/{$num_instances} instances
        <span>satisfy the {selectedConstraint.direction} constraint</span>.
      </div>
    </div>
    <div class="tw-flex tw-flex-1 tw-gap-4">
      <div class="tw-flex-1">
        <ConstraintICE
          constraint={selectedConstraint}
          indices={indices ? new Set(indices) : null}
        />
      </div>
      {#if hasSatisfiedInstances && hasUnsatisfiedInstances}
        <div class="tw-w-px tw-bg-gray-200" />
        <div class="tw-flex-1">
          <ConstraintsDescriptions
            on:filter={onFilterIndices}
            constraint={selectedConstraint}
          />
        </div>
      {/if}
    </div>
  </div>
</div>
