import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { DOMWidgetModel } from '@jupyter-widgets/base';

import type {
  Dataset,
  OneWayPD,
  FeatureInfo,
  DrawnPD,
  FeatureImportances,
} from './types';
import { getNiceDomain } from './vis-utils';

/**
 *
 * @param name_ Name of the variable in the model. This is the same as the
 *              name of the corresponding Python variable in widget.py
 * @param value_ Default value
 * @param model backbone model containing state synced between Python and JS
 * @returns Svelte store that is synced with the model.
 */
function createSyncedWidget<T>(
  name_: string,
  value_: T,
  model: DOMWidgetModel
): Writable<T> {
  const name: string = name_;
  const internalWritable: Writable<T> = writable(value_);

  // TODO: type this
  const modelValue = model.get(name);
  if (modelValue !== undefined) {
    internalWritable.set(modelValue);
  }

  // when the model changes, update the store
  model.on('change:' + name, () => internalWritable.set(model.get(name)), null);

  return {
    // when the store changes, update the model
    set: (v: T) => {
      internalWritable.set(v);
      if (model) {
        model.set(name, v);
        model.save_changes();
      }
    },
    subscribe: internalWritable.subscribe,
    update: (func: (v: T) => T) => {
      internalWritable.update((v: T) => {
        const output = func(v);
        if (model) {
          model.set(name, output);
          model.save_changes();
        }
        return output;
      });
    },
  };
}

// ==== Stores that are synced with traitlets ====

export let dataset: Writable<Dataset>;
export let labels: Writable<number[]>;
export let num_instances: Writable<number>;
export let feature_info: Writable<Record<string, FeatureInfo>>;

export let pds: Writable<Record<string, OneWayPD>>;
export let pd_extent: Writable<[number, number]>;

export let ices: Writable<Record<string, number[][]>>;

export let feature_names: Writable<string[]>;

export let model_output_short: Writable<string>;
export let model_output_long: Writable<string>;

export let height: Writable<number>;

export let drawn_pds: Writable<Record<string, DrawnPD>>;

export let mental_model_file_path: Writable<string>;
export let save_file_clicked: Writable<number>;
export let save_file_result: Writable<{ num: number; error: string }>;

export let feature_importances: Writable<FeatureImportances>;

export let constraints: Writable<
  Record<string, '' | 'increasing' | 'decreasing'>
>;

// ==== Stores that are not synced with traitlets ====

export let pageIndex: Writable<number>;
export let selectedFeatures: Writable<string[]>;
export let nextButtonEnabled: Writable<boolean>;
export let pdExtentNice: Readable<[number, number]>;

/**
 * Note that when the cell containing the widget is re-run, a new model is
 * created. We don't want the former model to hang around. We don't want state
 * to carry over when the widget is re-run. That's why all of the stores are
 * initialized in this function, which is called when the widget's cell is run.
 * @param model backbone model that contains state synced between Python and JS
 */
export function setStores(model: DOMWidgetModel): void {
  // ==== Stores that are synced with traitlets ====

  dataset = createSyncedWidget<Dataset>('dataset', {}, model);
  labels = createSyncedWidget<number[]>('labels', [], model);
  num_instances = createSyncedWidget<number>('num_instances', 0, model);
  feature_info = createSyncedWidget<Record<string, FeatureInfo>>(
    'feature_info',
    {},
    model
  );

  pds = createSyncedWidget<Record<string, OneWayPD>>('pds', {}, model);
  pd_extent = createSyncedWidget<[number, number]>('pd_extent', [0, 0], model);

  ices = createSyncedWidget<Record<string, number[][]>>('ices', {}, model);

  feature_names = createSyncedWidget<string[]>('feature_names', [], model);

  model_output_short = createSyncedWidget<string>(
    'model_output_short',
    '',
    model
  );
  model_output_long = createSyncedWidget<string>(
    'model_output_long',
    '',
    model
  );

  height = createSyncedWidget<number>('height', 600, model);

  drawn_pds = createSyncedWidget<Record<string, DrawnPD>>(
    'drawn_pds',
    {},
    model
  );

  mental_model_file_path = createSyncedWidget<string>(
    'mental_model_file_path',
    '',
    model
  );

  save_file_clicked = createSyncedWidget<number>('save_file_clicked', 0, model);

  save_file_result = createSyncedWidget<{ num: number; error: string }>(
    'save_file_result',
    { num: 0, error: '' },
    model
  );

  feature_importances = createSyncedWidget<FeatureImportances>(
    'feature_importances',
    {},
    model
  );

  constraints = createSyncedWidget<
    Record<string, '' | 'increasing' | 'decreasing'>
  >('constraints', {}, model);

  // ==== Stores that are not synced with traitlets ====

  pageIndex = writable(0);
  selectedFeatures = writable([]);
  nextButtonEnabled = writable(false);
  pdExtentNice = derived(pd_extent, ($pd_extent) => getNiceDomain($pd_extent));
}
