<script lang="ts">
  import { height, progress } from './stores';
  import Progress from './components/Progress.svelte';

  $: ({ step } = progress);
</script>

<!-- not using tailwind for the root component of the widget -->
<div
  id="monomoy-container"
  class="monomoy-container"
  style:height="{$height}px"
  style:width="100%"
>
  <div
    class="tw-flex tw-h-full tw-w-full tw-flex-col tw-bg-gray-100 tw-font-sans tw-text-base"
  >
    <Progress />
    <div class="tw-min-h-0 tw-flex-1 tw-px-8 tw-py-4">
      <svelte:component this={$step.component} />
    </div>
  </div>
</div>
