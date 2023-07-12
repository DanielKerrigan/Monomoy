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
  class="monomoy-containe"
  style:height="{$height}px"
  style:width="100%"
  style:border="1px solid #d1d5db"
>
  <svelte:component this={pages[$pageIndex]} />
</div>
