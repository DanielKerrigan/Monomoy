<script lang="ts">
  import { progress } from '../stores';

  $: ({ step } = progress);
  $: step.setComplete(true);
</script>

<div class="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-text-base">
  <p class="tw-w-128">
    Thank you for providing information about your mental model. In the
    remaining steps, Monomoy will compare your mental model to the machine
    learning model. The goal of this is to highlight discrepancies between the
    two.
  </p>
  <p class="tw-w-128">
    Press the "Next" button in the top-right corner to continue.
  </p>
</div>
