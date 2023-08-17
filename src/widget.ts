// Copyright (c) me
// Distributed under the terms of the Modified BSD License.

import { DOMWidgetModel, DOMWidgetView } from '@jupyter-widgets/base';

import type { ISerializers } from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';

import { setStores } from './stores';

import Widget from './components/Widget.svelte';

export class ExampleModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ExampleModel.model_name,
      _model_module: ExampleModel.model_module,
      _model_module_version: ExampleModel.model_module_version,
      _view_name: ExampleModel.view_name,
      _view_module: ExampleModel.view_module,
      _view_module_version: ExampleModel.view_module_version,
      dataset: {},
      labels: [],
      num_instances: 0,
      feature_info: {},
      pds: {},
      pd_extent: [0, 0],
      ices: {},
      feature_names: [],
      model_output_short: '',
      model_output_long: '',
      height: 600,
      drawn_pds: {},
      mental_model_file_path: '',
      save_file_clicked: 0,
      save_file_result: { num: 0, error: '' },
      feature_importances: {},
      constraints: {},
      constraints_feedback: [],
      selected_features: [],
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'ExampleModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'ExampleView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class ExampleView extends DOMWidgetView {
  render() {
    setStores(this.model);
    new Widget({ target: this.el });
  }
}
