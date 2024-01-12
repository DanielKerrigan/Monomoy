import FeatureImportanceSelectionPage from './pages/FeatureImportanceSelectionPage.svelte';
import FeatureImportanceFeedbackPage from './pages/FeatureImportanceFeedbackPage.svelte';
import DrawingPage from './pages/DrawingPage.svelte';
import IntroductionPage from './pages/IntroductionPage.svelte';
import DrawingFeedbackPage from './pages/DrawingFeedbackPage.svelte';
import TransitionPage from './pages/TransitionPage.svelte';
import SavePage from './pages/SavePage.svelte';
import ConstraintsSelectionPage from './pages/ConstraintsSelectionPage.svelte';
import ConstraintsFeedbackPage from './pages/ConstraintsFeedbackPage.svelte';
import type { Part, Step } from './types';
import InteractionsSelectionPage from './pages/InteractionsSelectionPage.svelte';
import InteractionsFeedbackPage from './pages/InteractionsFeedbackPage.svelte';

const elicitationSteps: Step[] = [
  {
    component: FeatureImportanceSelectionPage,
    title: 'Importance',
    enabled: false,
    complete: false,
    showNextButton: true,
  },
  {
    component: DrawingPage,
    title: 'Relationships',
    enabled: false,
    complete: false,
    showNextButton: true,
  },
  {
    component: ConstraintsSelectionPage,
    title: 'Constraints',
    enabled: false,
    complete: false,
    showNextButton: true,
  },
  {
    component: InteractionsSelectionPage,
    title: 'Interactions',
    enabled: false,
    complete: false,
    showNextButton: true,
  },
];

const reviewSteps: Step[] = [
  {
    component: FeatureImportanceFeedbackPage,
    title: 'Importance',
    enabled: false,
    complete: false,
    showNextButton: true,
  },
  {
    component: DrawingFeedbackPage,
    title: 'Relationships',
    enabled: false,
    complete: false,
    showNextButton: true,
  },
  {
    component: ConstraintsFeedbackPage,
    title: 'Constraints',
    enabled: false,
    complete: false,
    showNextButton: true,
  },
  {
    component: InteractionsFeedbackPage,
    title: 'Interactions',
    enabled: false,
    complete: false,
    showNextButton: true,
  },
];

const transitionStep: Step = {
  component: TransitionPage,
  title: 'transition',
  enabled: false,
  complete: false,
  showNextButton: true,
};

const saveStep: Step = {
  component: SavePage,
  title: 'Save',
  enabled: false,
  complete: false,
  showNextButton: false,
};

const introPart: Part = {
  title: 'Monomoy',
  steps: [
    {
      title: 'Introduction',
      component: IntroductionPage,
      enabled: false,
      complete: false,
      showNextButton: false,
    },
  ],
};

export const workflow: Part[] = [
  introPart,
  {
    title: 'Expectations',
    steps: [...elicitationSteps],
  },
  {
    title: 'Monomoy',
    steps: [transitionStep],
  },
  {
    title: 'Comparison',
    steps: [...reviewSteps, saveStep],
  },
];
