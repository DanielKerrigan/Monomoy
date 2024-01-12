<script lang="ts">
  import {
    progress,
    mental_model_file_path,
    save_file_clicked,
    save_file_result,
  } from '../stores';

  let state: 'Save' | 'Saving' | 'Saved' = 'Save';

  function onSaveClick() {
    if (state !== 'Save') {
      return;
    }
    $save_file_clicked += 1;
    state = 'Saving';
  }

  $: if (state === 'Saving' && $save_file_clicked === $save_file_result.num) {
    state = $save_file_result.error ? 'Save' : 'Saved';
  }

  $: ({ step } = progress);
  $: step.setComplete(true);
</script>

<div class="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-text-base">
  <p class="tw-w-128">Enter a file name to save your mental model to.</p>
  {#if state === 'Save' && $save_file_result.error}
    <p class="tw-w-128 tw-break-words">
      Saving failed with the following error: {$save_file_result.error}
    </p>
  {/if}
  <div class="tw-flex tw-w-128 tw-items-center tw-gap-1">
    <input
      class="tw-w-0 tw-flex-1 tw-rounded-md tw-border tw-border-gray-400 tw-px-2 tw-py-1 focus:tw-border-indigo-500 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-indigo-500"
      disabled={state !== 'Save'}
      bind:value={$mental_model_file_path}
    />
    <button
      disabled={$mental_model_file_path.length === 0 || state !== 'Save'}
      on:click={onSaveClick}
      class="tw-rounded-md tw-bg-indigo-600 tw-px-2 tw-py-1 tw-text-white hover:tw-bg-indigo-700 active:tw-bg-indigo-800 disabled:tw-cursor-not-allowed disabled:tw-bg-gray-300"
      >{state}</button
    >
  </div>
</div>
