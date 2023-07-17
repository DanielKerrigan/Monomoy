#!/usr/bin/env python
# coding: utf-8

"""
Compute partial dependence plots
"""

import json
from pathlib import Path
from typing import Callable, Dict, List, Tuple, Union

import numpy as np
import pandas as pd
from joblib import Parallel, delayed
from tqdm import tqdm

from monomoy.metadata import Metadata
from monomoy.tqdm_joblib import tqdm_joblib


def compute_widget_data(
    *,
    predict: Callable[[pd.DataFrame], List[float]],
    df: pd.DataFrame,
    features: List[str],
    model_output_label: str,
    model_description: str,
    resolution: int = 20,
    one_hot_features: Union[Dict[str, List[Tuple[str, str]]], None] = None,
    nominal_features: Union[List[str], None] = None,
    ordinal_features: Union[List[str], None] = None,
    feature_value_mappings: Union[Dict[str, Dict[str, str]], None] = None,
    n_jobs: int = 1,
    output_path: Union[str, None] = None,
) -> Union[dict, None]:
    """Calculates the data needed for the widget. This includes computing the
    data for the PDP and ICE plots, calculating the metrics
    to rank the plots by, and clustering the lines within
    each ICE plot.

    :param predict: A function whose input is a DataFrame of instances and
        returns the model's predictions on those instances.
    :type predict: Callable[[pd.DataFrame], list[float]]
    :param df: Instances to use to compute the PDPs and ICE plots.
    :type df: pd.DataFrame
    :param features: List of feature names to compute the plots for.
    :type features: list[str]
    :param resolution: For quantitative features, the number of evenly
        spaced to use to compute the plots, defaults to 20.
    :type resolution: int, optional
    :param one_hot_features: A dictionary that maps from the name of a feature
        to a list tuples containg the corresponding one-hot encoded column
        names and feature values, defaults to None.
    :type one_hot_features: dict[str, list[tuple[str, str]]] | None, optional
    :param nominal_features: List of nominal and binary features in the
        dataset that are not one-hot encoded. If None, defaults to binary
        features in the dataset.
    :type nominal_features: list[str] | None, optional
    :param ordinal_features: List of ordinal features in the dataset.
        If None, defaults to integer features with 3-12 unique values.
    :type ordinal_features: list[str] | None, optional
    :param feature_value_mappings: Nested dictionary that maps from the name
        of a nominal or ordinal feature, to a value for that feature in
        the dataset, to the desired label for that value in the UI,
        defaults to None.
    :type feature_value_mappings: dict[str, dict[str, str]] | None, optional
    :param num_clusters_extent: The minimum and maximum number of clusters to
        try when clustering the lines of ICE plots. Defaults to (2, 5).
    :type num_clusters_extent: tuple[int, int]
    :param mixed_shape_tolerance: Quantitative and ordinal one-way PDPs are labeled
        as having positive, negative, or mixed shapes. A lower value for this parameter
        leads to more PDPs being labeled as positive or negative and fewer being
        labeled as mixed. A higher value leads to more being labeled as mixed.
        Must be in the range [0, 0.5]. Defaults to 0.15.
    :type mixed_shape_tolerance: float
    :param n_jobs: Number of jobs to use to parallelize computation,
        defaults to 1.
    :type n_jobs: int, optional
    :param seed:  Random state for clustering. Defaults to None.
    :type seed: int | None, optional
    :param output_path: A file path to write the results to.
        If None, then the results are instead returned.
    :type output_path: str | None, optional
    :raises OSError: Raised when the ``output_path``, if provided, cannot be written to.
    :return: Wigdet data, or None if an ``output_path`` is provided.
    :rtype: dict | None
    """

    # first check that the output path exists if provided so that the function
    # can fail quickly, rather than waiting until all the work is done
    if output_path:
        path = Path(output_path).resolve()

        if not path.parent.is_dir():
            raise OSError(f"Cannot write to {path.parent}")

    md = Metadata(
        df,
        resolution,
        one_hot_features,
        nominal_features,
        ordinal_features,
        feature_value_mappings,
    )

    # TODO: reset index?
    subset = df.copy()
    subset_copy = df.copy()

    # one-way

    one_way_work = [
        {
            "predict": predict,
            "data": subset,
            "data_copy": subset_copy,
            "feature": feature,
            "md": md,
        }
        for i, feature in enumerate(features)
    ]

    num_one_way = len(features)
    print(f"Calculating {num_one_way} one-way PDPs")

    if n_jobs == 1:
        one_way_results = [
            _calc_one_way_pd(**args) for args in tqdm(one_way_work, ncols=80)
        ]
    else:
        with tqdm_joblib(tqdm(total=num_one_way, unit="PDP", ncols=80)) as _:
            one_way_results = Parallel(n_jobs=n_jobs)(
                delayed(_calc_one_way_pd)(**args) for args in one_way_work
            )

    pds = {owp["feature"]: owp for owp, _ in one_way_results}
    ices = {owp["feature"]: lines for owp, lines in one_way_results}

    # to make the dataset easier to work with on the frontend,
    # turn one-hot encoded features into integer encoded categories
    frontend_df = _turn_one_hot_into_category(subset, md)

    # output

    results = {
        "dataset": frontend_df.to_dict(orient="list"),
        "num_instances": md.size,
        "feature_info": md.feature_info,
        "pds": pds,
        "ices": ices,
        "model_output_label": model_output_label,
        "model_description": model_description,
    }

    if output_path:
        path.write_text(json.dumps(results), encoding="utf-8")
    else:
        return results


def _calc_one_way_pd(
    predict,
    data,
    data_copy,
    feature,
    md,
):
    feat_info = md.feature_info[feature]

    ice_lines = []

    for value in feat_info["values"]:
        _set_feature(feature, value, data, feat_info)
        predictions = predict(data)
        ice_lines.append(predictions.tolist())

    _reset_feature(feature, data, data_copy, feat_info)

    ice_lines = np.array(ice_lines).T
    ice_deviation = np.std(ice_lines, axis=1).mean().item()
    mean_predictions = np.mean(ice_lines, axis=0)

    pdp_min = mean_predictions.min().item()
    pdp_max = mean_predictions.max().item()

    mean_predictions = mean_predictions.tolist()

    par_dep = {
        "feature": feature,
        "x_values": feat_info["values"],
        "mean_predictions": mean_predictions,
        "pdp_min": pdp_min,
        "pdp_max": pdp_max,
        "ice_min": ice_lines.min().item(),
        "ice_max": ice_lines.max().item(),
        "deviation": ice_deviation,
    }

    return par_dep, ice_lines.tolist()


def _set_feature(feature, value, data, feature_info):
    if feature_info["subkind"] == "one_hot":
        col = feature_info["value_to_column"][feature_info["value_map"][value]]
        all_features = [feat for feat, _ in feature_info["columns_and_values"]]
        data[all_features] = 0
        data[col] = 1
    else:
        data[feature] = value


def _reset_feature(
    feature,
    data,
    data_copy,
    feature_info,
):
    if feature_info["subkind"] == "one_hot":
        all_features = [col for col, _ in feature_info["columns_and_values"]]
        data[all_features] = data_copy[all_features]
    else:
        data[feature] = data_copy[feature]


def _turn_one_hot_into_category(df_one_hot, md):
    df = df_one_hot.copy()

    for feature in md.one_hot_feature_names:
        info = md.feature_info[feature]
        # one-hot column names
        columns = [col for (col, _) in info["columns_and_values"]]
        # undo one-hot encoding. this results in one categorical series
        # where the categories are the original column names
        # https://stackoverflow.com/a/61251205/5016634
        as_category = df[columns].idxmax(axis=1)
        # map from one-hot column name to index
        column_to_index = dict(zip(columns, info["values"]))
        # turn the categories into integers
        int_series = as_category.map(column_to_index).values
        # remove the one-hot columns from the df and add the integer column
        df.drop(columns=columns, inplace=True)
        df[feature] = int_series

    return df
