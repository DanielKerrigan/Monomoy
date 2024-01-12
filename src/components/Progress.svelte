<script lang="ts">
  import { progress } from '../stores';

  $: ({ part, step, position } = progress);
</script>

<div class="tw-flex tw-h-8 tw-items-center tw-bg-gray-200">
  <div class="tw-px-2 tw-text-lg">{$part.title}</div>

  {#if $part.steps.length > 1}
    <div class="tw-flex tw-min-w-0 tw-flex-1 tw-justify-evenly">
      {#each $part.steps as { title, complete, enabled }, i}
        {@const current = title === $step.title}
        <button
          disabled={!enabled}
          on:click={() => position.set({ part: $position.part, step: i })}
          class={current
            ? 'tw-border-b tw-border-indigo-600 tw-text-indigo-600'
            : enabled
            ? 'tw-border-b tw-border-transparent tw-text-indigo-600'
            : 'tw-cursor-not-allowed tw-border-b tw-border-transparent tw-text-gray-400'}
        >
          <div class="tw-flex tw-items-center tw-gap-1">
            {#if complete}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="tw-h-5 tw-w-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clip-rule="evenodd"
                />
              </svg>
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor"
                class="tw-h-5 tw-w-5"
              >
                <circle cx="10" cy="10" r="7.5" />
              </svg>
            {/if}
            <div>{title}</div>
          </div>
        </button>
      {/each}
    </div>
  {/if}

  <button
    disabled={!$step.complete}
    on:click={() => position.nextStep()}
    class:tw-invisible={!$step.showNextButton}
    class="tw-ml-auto tw-bg-indigo-600 tw-px-2 tw-py-1 tw-text-white hover:tw-bg-indigo-700 active:tw-bg-indigo-800 disabled:tw-cursor-not-allowed disabled:tw-bg-gray-400"
    >Next</button
  >
</div>
