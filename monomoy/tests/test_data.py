""" Unit tests for data.py """

import pytest
from monomoy.data import _parse_data_dictionary

# _parse_data_dictionary tests


def test_parse_data_dict_no_feature_model_key():
    """Test that a KeyError is raised when there is a midding feature_model key."""
    with pytest.raises(KeyError):
        data_dict = [
            {"feature_model": "a", "feature_description": "b"},
            {"feature_description": "b"},
            {"feature_model": "a", "feature_description": "b"},
        ]

        _parse_data_dictionary(data_dict)


def test_parse_data_dict_no_feature_description_key():
    """Test that a KeyError is raised when there is a midding feature_description key."""
    with pytest.raises(KeyError):
        data_dict = [
            {"feature_model": "a", "feature_description": "b"},
            {"feature_model": "a"},
            {"feature_model": "a", "feature_description": "b"},
        ]

        _parse_data_dictionary(data_dict)


def test_parse_data_dict_no_feature_model_value():
    """Test that a ValueError is raised when there is a missing value for feature_model."""
    with pytest.raises(ValueError):
        data_dict = [
            {"feature_model": "a", "feature_description": "b"},
            {"feature_model": "", "feature_description": "b"},
            {"feature_model": "a", "feature_description": "b"},
        ]

        _parse_data_dictionary(data_dict)


def test_parse_data_dict_no_feature_description_value():
    """Test that a ValueError is raised when there is a missing value for feature_description."""
    with pytest.raises(ValueError):
        data_dict = [
            {"feature_model": "a", "feature_description": "b"},
            {"feature_model": "a", "feature_description": ""},
            {"feature_model": "a", "feature_description": "b"},
        ]

        _parse_data_dictionary(data_dict)


def test_parse_data_dict_setting_feature_ui():
    """Test that feature_ui is properly set when it is missing."""
    data_dict = [
        {"feature_model": "a", "feature_description": "b", "feature_ui": "c"},
        {"feature_model": "a", "feature_description": "b", "feature_ui": ""},
        {"feature_model": "d", "feature_description": "b"},
    ]

    updated_dict = _parse_data_dictionary(data_dict)

    assert updated_dict[0]["feature_ui"] == "c"
    assert updated_dict[1]["feature_ui"] == "a"
    assert updated_dict[2]["feature_ui"] == "d"


def test_parse_data_dict_setting_feature_ui_file():
    """Test that feature_ui is properly set when it is missing when passing in a file."""
    updated_dict = _parse_data_dictionary("monomoy/tests/data_dict.csv")

    assert updated_dict[0]["feature_ui"] == "hour"
    assert updated_dict[1]["feature_ui"] == "month"
