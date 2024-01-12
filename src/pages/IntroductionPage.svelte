<script lang="ts">
  import {
    mental_model_provided,
    model_output_long,
    progress,
    feature_names,
    constraints,
    selected_features,
    drawn_pds,
  } from '../stores';

  $: ({ step, position } = progress);

  function resetExpectations() {
    $selected_features = [];
    $constraints = Object.fromEntries($feature_names.map((f) => [f, '']));
    $drawn_pds = Object.fromEntries(
      Object.entries($drawn_pds).map(([feature, pd]) => [
        feature,
        pd.map(({ x }) => ({ x, y: 0, drawn: false })),
      ])
    );
  }

  function onClickCompare() {
    step.setComplete(true);
    position.set({ part: 3, step: 0 });
  }

  function onClickEdit() {
    step.setComplete(true);
    position.nextStep();
  }

  function onClickScratch() {
    step.setComplete(true);
    resetExpectations();
    position.nextStep();
  }

  function onClickBegin() {
    step.setComplete(true);
    resetExpectations();
    position.nextStep();
  }
</script>

<div class="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-text-base">
  <p class="tw-w-128">
    Welcome! Monomoy is a tool to help you learn about and evaluate the behavior
    of a machine learning model. You will be analyzing a model that predicts {$model_output_long}.
  </p>

  {#if $mental_model_provided}
    <p class="tw-w-128">
      You have provided an expectations file. Choose what you would like to do
      below.
    </p>

    <div class="tw-flex tw-w-128 tw-flex-col tw-items-start tw-gap-2">
      <button
        on:click={onClickCompare}
        class="tw-rounded-md tw-bg-indigo-600 tw-px-2 tw-py-1 tw-text-white hover:tw-bg-indigo-700 active:tw-bg-indigo-800"
        >Compare expectations to model</button
      >
      <button
        on:click={onClickEdit}
        class="tw-rounded-md tw-bg-indigo-600 tw-px-2 tw-py-1 tw-text-white hover:tw-bg-indigo-700 active:tw-bg-indigo-800"
        >Edit expectations</button
      >
      <button
        on:click={onClickScratch}
        class="tw-rounded-md tw-bg-indigo-600 tw-px-2 tw-py-1 tw-text-white hover:tw-bg-indigo-700 active:tw-bg-indigo-800"
        >Start from scratch</button
      >
    </div>
  {:else}
    <p class="tw-w-128">
      The workflow will have two parts. In the first part, Monomoy will walk you
      through a series of steps that will ask how you expect the model should
      behave. In the second part, Monomoy will let you compare your expectations
      to the model's behavior.
    </p>

    <div class="tw-w-128">
      <button
        on:click={onClickBegin}
        class="tw-rounded-md tw-bg-indigo-600 tw-px-2 tw-py-1 tw-text-white hover:tw-bg-indigo-700 active:tw-bg-indigo-800"
        >Begin</button
      >
    </div>
  {/if}
</div>
