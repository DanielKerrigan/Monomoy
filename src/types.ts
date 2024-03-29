// Dataset

import type { ComponentType } from 'svelte';
import type { Readable } from 'svelte/store';

export type Dataset = Record<string, number[]>;

// Distribution

export type Distribution = {
  bins: number[];
  counts: number[];
  percents: number[];
};

// Features

export type OneHotFeatureInfo = {
  kind: 'categorical';
  subkind: 'one_hot';
  ordered: false;
  values: number[];
  distribution: Distribution;
  columns_and_values: [string, string][];
  value_to_column: Record<string, string>;
  value_map: Record<number, string>;
  display: string;
  description: string;
};

export type NominalFeatureInfo = {
  kind: 'categorical';
  subkind: 'nominal';
  ordered: false;
  values: number[];
  distribution: Distribution;
  value_map: Record<number, string>;
  display: string;
  description: string;
};

export type OrdinalFeatureInfo = {
  kind: 'categorical';
  subkind: 'ordinal';
  ordered: true;
  values: number[];
  distribution: Distribution;
  value_map: Record<number, string>;
  display: string;
  description: string;
};

export type ContinuousFeatureInfo = {
  kind: 'quantitative';
  subkind: 'continuous';
  ordered: true;
  values: number[];
  distribution: Distribution;
  display: string;
  description: string;
};

export type DiscreteFeatureInfo = {
  kind: 'quantitative';
  subkind: 'discrete';
  ordered: true;
  values: number[];
  distribution: Distribution;
  display: string;
  description: string;
};

export type QuantitativeFeatureInfo =
  | ContinuousFeatureInfo
  | DiscreteFeatureInfo;
export type CategoricalFeatureInfo =
  | OneHotFeatureInfo
  | NominalFeatureInfo
  | OrdinalFeatureInfo;
export type FeatureInfo = QuantitativeFeatureInfo | CategoricalFeatureInfo;

// Partial dependence

export type OneWayPD = {
  feature: string;
  x_values: number[];
  mean_predictions: number[];
  pdp_min: number;
  pdp_max: number;
  ice_min: number;
  ice_max: number;
  deviation: number;
};

export type DrawnPD = { x: number; y: number; drawn: boolean }[];

export type Trend = {
  id: number;
  drawing: DrawnPD;
  color: string;
};

export type FeatureImportances = Record<
  string,
  { rank: number; score: number }
>;

export type ConstraintFeedback = {
  feature: string;
  direction: string;
  satisfies: number[];
  unsatisfies: number[];
  explaining_features: string[];
};

export type RaincloudData = {
  values: { value: number; label: number }[];
  densities: {
    x: number;
    density: number;
  }[];
  mean: number;
};

// progress

export type Mode = 'initial' | 'scratch' | 'compare' | 'modify';

export type Part = {
  title: string;
  steps: Step[];
};

export type Step = {
  title: string;
  component: ComponentType;
  enabled: boolean;
  complete: boolean;
  showNextButton: boolean;
};

export type Workflow = Part[];

export type Position = { part: number; step: number };

export type Progress = {
  part: Readable<Part> & {
    setNextStepsIncomplete(): void;
  };
  step: Readable<Step> & {
    setComplete(isComplete: boolean): void;
  };
  position: Readable<Position> & {
    set(this: void, value: Position): void;
    nextStep(): void;
  };
};
