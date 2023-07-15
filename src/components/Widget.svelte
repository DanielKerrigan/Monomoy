<script lang="ts">
  import { height, pageIndex } from '../stores';
  import FeatureSelectionPage from './FeatureSelectionPage.svelte';
  import DrawingPage from './DrawingPage.svelte';
  import DrawingFeedbackPage from './DrawingFeedbackPage.svelte';

  const pages = [FeatureSelectionPage, DrawingPage, DrawingFeedbackPage];
</script>

<!-- not using tailwind for the root component of the widget -->
<div
  id="monomoy-container"
  class="monomoy-container"
  style:height="{$height}px"
  style:width="100%"
>
  <div
    class="tw-h-full tw-w-full tw-bg-gray-100 tw-p-8 tw-font-sans tw-text-base"
  >
    <svelte:component this={pages[$pageIndex]} />
  </div>
</div>
