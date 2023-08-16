<script lang="ts">
  export let segments: { value: string; label: string; enabled: boolean }[];
  export let selectedValue: string;
  export let title = '';
  export let allowUnselected: boolean;

  function onClickSegment(value: string) {
    if (selectedValue === value && allowUnselected) {
      selectedValue = '';
    } else {
      selectedValue = value;
    }
  }
</script>

<div class="tw-flex tw-items-center tw-gap-1">
  {#if title}
    <div class="tw-font-bold">{title}</div>
  {/if}
  <div class="tw-inline-grid tw-auto-cols-fr tw-grid-flow-col">
    {#each segments as { value, label, enabled }}
      <button
        class="tw-border tw-border-l-0 tw-border-indigo-600 tw-px-1 tw-py-0.5 first:tw-rounded-l first:tw-border-l last:tw-rounded-r hover:tw-border-indigo-700 active:tw-border-indigo-800 disabled:tw-cursor-not-allowed disabled:tw-border-gray-300 disabled:tw-bg-white disabled:tw-text-gray-300 {value ===
        selectedValue
          ? 'tw-bg-indigo-600 tw-text-white hover:tw-bg-indigo-700 active:tw-bg-indigo-800'
          : 'tw-bg-white tw-text-indigo-600 hover:tw-text-indigo-700 active:tw-text-indigo-800'}"
        disabled={!enabled}
        on:click={() => onClickSegment(value)}>{label}</button
      >
    {/each}
  </div>
</div>
