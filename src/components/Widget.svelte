<script lang="ts">
  import { height, pageIndex } from '../stores';
  import FeatureImportanceSelectionPage from '../pages/FeatureImportanceSelectionPage.svelte';
  import FeatureImportanceFeedbackPage from '../pages/FeatureImportanceFeedbackPage.svelte';
  import DrawingPage from '../pages/DrawingPage.svelte';
  import IntroductionPage from '../pages/IntroductionPage.svelte';
  import DrawingFeedbackPage from '../pages/DrawingFeedbackPage.svelte';
  import Progress from './Progress.svelte';
  import TransitionPage from '../pages/TransitionPage.svelte';
  import SavePage from '../pages/SavePage.svelte';
  import ConstraintsSelectionPage from '../pages/ConstraintsSelectionPage.svelte';
  import ConstraintsFeedbackPage from '../pages/ConstraintsFeedbackPage.svelte';

  const pages = [
    IntroductionPage,
    FeatureImportanceSelectionPage,
    DrawingPage,
    ConstraintsSelectionPage,
    TransitionPage,
    FeatureImportanceFeedbackPage,
    DrawingFeedbackPage,
    ConstraintsFeedbackPage,
    SavePage,
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
    <div class="tw-min-h-0 tw-flex-1">
      <svelte:component this={pages[$pageIndex]} />
    </div>
  </div>
</div>
