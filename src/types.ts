// Dataset

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
};

export type NominalFeatureInfo = {
  kind: 'categorical';
  subkind: 'nominal';
  ordered: false;
  values: number[];
  distribution: Distribution;
  value_map: Record<number, string>;
};

export type OrdinalFeatureInfo = {
  kind: 'categorical';
  subkind: 'ordinal';
  ordered: true;
  values: number[];
  distribution: Distribution;
  value_map: Record<number, string>;
};

export type ContinuousFeatureInfo = {
  kind: 'quantitative';
  subkind: 'continuous';
  ordered: true;
  values: number[];
  distribution: Distribution;
};

export type DiscreteFeatureInfo = {
  kind: 'quantitative';
  subkind: 'discrete';
  ordered: true;
  values: number[];
  distribution: Distribution;
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
