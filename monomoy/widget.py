#!/usr/bin/env python
# coding: utf-8

# Copyright (c) me.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

import json
from pathlib import Path
from typing import Callable, List, Union

import numpy as np
import pandas as pd
from ipywidgets import DOMWidget
from traitlets import Dict, Int, Unicode, observe
from traitlets import List as ListTraitlet

from ._frontend import module_name, module_version
from .data import get_initial_drawn_pds


class ExampleWidget(DOMWidget):
    """TODO: Add docstring here"""

    _model_name = Unicode("ExampleModel").tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode("ExampleView").tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    # widget state that is synced between Python and JavaScript

    dataset = Dict({}).tag(sync=True)
    labels = ListTraitlet([]).tag(sync=True)
    num_instances = Int(0).tag(sync=True)
    feature_info = Dict({}).tag(sync=True)

    pds = Dict({}).tag(sync=True)
    pd_extent = ListTraitlet([0, 0]).tag(sync=True)

    ices = Dict({}).tag(sync=True)

    feature_names = ListTraitlet([]).tag(sync=True)

    model_output_short = Unicode("").tag(sync=True)
    model_output_long = Unicode("").tag(sync=True)

    height = Int(600).tag(sync=True)

    drawn_pds = Dict({}).tag(sync=True)

    mental_model_file_path = Unicode("").tag(sync=True)
    save_file_clicked = Int(0).tag(sync=True)
    save_file_result = Dict({"num": 0, "error": ""}).tag(sync=True)

    feature_importances = Dict({}).tag(sync=True)

    """
    The ice lines are a lot of data, so we want to limit how often we have to
    transfer them between the backend and frontend. If they were a part of
    one_way_pds, then they would get sent whenever the ICE clusters get
    adjusted in the detailed plot view. By separating them out, adjusting
    the clusters becomes faster and won't run into the "message too big"
    errors with tornado.
    """
    ices = Dict({}).tag(sync=True)

    def __init__(
        self,
        predict: Callable[[pd.DataFrame], List[float]],
        df: pd.DataFrame,
        labels: Union[List[float], List[int], np.ndarray, pd.Series],
        data: Union[str, Path, dict],
        height: int = 600,
        **kwargs,
    ):
        super().__init__(**kwargs)

        # if data is a path or string, then read the file at that path
        if isinstance(data, Path) or isinstance(data, str):
            path = Path(data).resolve()

            if not path.exists():
                raise OSError(f"Cannot read {path}")

            data = path.read_text(encoding="utf-8")
            data = json.loads(data)

        # synced widget state

        self.dataset = data["dataset"]
        self.labels = (
            labels.tolist() if isinstance(labels, (np.ndarray, pd.Series)) else labels
        )
        self.num_instances = data["num_instances"]
        self.feature_info = data["feature_info"]

        self.pds = data["pds"]
        self.pd_extent = data["pd_extent"]

        self.ices = data["ices"]

        self.feature_names = sorted(data["pds"].keys())

        self.model_output_short = data["model_output_short"]
        self.model_output_long = data["model_output_long"]

        self.feature_importances = data["feature_importances"]

        self.height = height

        self.drawn_pds = get_initial_drawn_pds(self.pds)

        # not synced

        self.df = df
        self.predict = predict

    @observe("save_file_clicked")
    def _on_save_file_clicked(self, change):
        num = change["new"]

        try:
            path = Path(self.mental_model_file_path).resolve()
            with open(path, "w", encoding="utf-8") as json_file:
                json.dump({}, json_file)
            error_message = ""
        except OSError as error:
            error_message = error.strerror

        self.save_file_result = {"num": num, "error": error_message}
