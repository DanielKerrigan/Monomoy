<script lang="ts">
  import { nextButtonEnabled, model_output_long } from '../stores';

  $: $nextButtonEnabled = true;
</script>

<div class="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-text-base">
  <p class="tw-w-128">
    Welcome! Monomoy is a tool to help you analyze the behavior of a machine
    learning model. It will walk you through a series of steps that will ask you
    questions about how you expect the model to behave and then let you compare
    your expectations to the model's behavior.
  </p>
  <p class="tw-w-128">
    You will be analyzing a model that predicts {$model_output_long}.
  </p>
  <p class="tw-w-128">
    Press the "Next" button in the top-right corner to continue.
  </p>
</div>
