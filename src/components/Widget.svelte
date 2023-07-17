<script lang="ts">
  import { height, pageIndex } from '../stores';
  import FeatureSelectionPage from './FeatureSelectionPage.svelte';
  import DrawingPage from './DrawingPage.svelte';
  import IntroductionPage from './IntroductionPage.svelte';
  import DrawingFeedbackPage from './DrawingFeedbackPage.svelte';
  import Progress from './Progress.svelte';

  const pages = [
    IntroductionPage,
    FeatureSelectionPage,
    DrawingPage,
    DrawingFeedbackPage,
  ];
</script>

<!-- not using tailwind for the root component of the widget -->
<div
  id="monomoy-container"
  class="monomoy-container"
  style:height="{$height}px"
  style:width="100%"
>
  <div
    class="tw-flex tw-h-full tw-w-full tw-flex-col tw-gap-8 tw-bg-gray-100 tw-px-8 tw-py-4 tw-font-sans tw-text-base"
  >
    <Progress numSteps={pages.length} />
    <svelte:component this={pages[$pageIndex]} />
  </div>
</div>
