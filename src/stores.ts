import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { DOMWidgetModel } from '@jupyter-widgets/base';

import type {
  Dataset,
  OneWayPD,
  FeatureInfo,
  DrawnPD,
  FeatureImportances,
  ConstraintFeedback,
  Workflow,
  Part,
  Step,
  Position,
  Progress,
  Mode,
  Trend,
} from './types';
import { getNiceDomain } from './vis-utils';
import { workflow } from './workflows';

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

export let mental_model_provided: Writable<boolean>;
export let mental_model_file_path: Writable<string>;
export let save_file_clicked: Writable<number>;
export let save_file_result: Writable<{ num: number; error: string }>;

export let feature_importances: Writable<FeatureImportances>;

export let constraints: Writable<
  Record<string, '' | 'increasing' | 'decreasing'>
>;

export let constraints_feedback: Writable<ConstraintFeedback[]>;

export let feature_trends: Writable<Record<string, Trend[]>>;

export let selected_features: Writable<string[]>;

// ==== Stores that are not synced with traitlets ====

function createProgress(): Progress {
  let pos = { part: 0, step: 0 };

  const position: Writable<Position> = writable(pos);
  const part: Writable<Part> = writable(workflow[0]);
  const step: Writable<Step> = writable(workflow[0].steps[0]);

  function setComplete(isComplete: boolean) {
    step.update((s) => {
      s.complete = isComplete;

      const nextPos = getNextPosition(pos, workflow);

      workflow[nextPos.part].steps[nextPos.step].enabled = isComplete;

      part.set(workflow[pos.part]);

      return s;
    });
  }

  function setNextStepsIncomplete() {
    part.update((p) => {
      for (let i = pos.step + 1; i < p.steps.length; i++) {
        p.steps[i].complete = false;
        p.steps[i].enabled = false;
      }

      return p;
    });
  }

  function nextStep() {
    position.update((p) => {
      pos = getNextPosition(p, workflow);
      part.set(workflow[pos.part]);
      step.set(workflow[pos.part].steps[pos.step]);
      return pos;
    });
  }

  function getNextPosition(p: Position, wf: Workflow): Position {
    const currentPart = wf[p.part];

    if (p.step < currentPart.steps.length - 1) {
      return { part: p.part, step: p.step + 1 };
    } else if (p.part < wf.length - 1) {
      return { part: p.part + 1, step: 0 };
    } else {
      return p;
    }
  }

  function setPosition(p: Position) {
    if (p.part < workflow.length && p.step < workflow[p.part].steps.length) {
      pos = p;
      position.set(p);
      part.set(workflow[p.part]);
      step.set(workflow[p.part].steps[p.step]);
    }
  }

  return {
    part: { subscribe: part.subscribe, setNextStepsIncomplete },
    step: { subscribe: step.subscribe, setComplete },
    position: { subscribe: position.subscribe, set: setPosition, nextStep },
  };
}

export let pdExtentNice: Readable<[number, number]>;
export let mode: Writable<Mode>;
export let progress: Progress;

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

  mental_model_provided = createSyncedWidget<boolean>(
    'mental_model_provided',
    false,
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

  constraints_feedback = createSyncedWidget<ConstraintFeedback[]>(
    'constraints_feedback',
    [],
    model
  );

  selected_features = createSyncedWidget<string[]>(
    'selected_features',
    [],
    model
  );

  feature_trends = createSyncedWidget<Record<string, Trend[]>>(
    'feature_trends',
    {},
    model
  );

  // ==== Stores that are not synced with traitlets ====

  pdExtentNice = derived(pd_extent, ($pd_extent) => getNiceDomain($pd_extent));
  progress = createProgress();
  mode = writable('initial');
}
