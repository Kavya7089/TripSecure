# utils/data_cleaning.py

import re
import pandas as pd

def clean_text(text: str) -> str:
    """
    Clean text fields (e.g., user input, feedback).
    - Lowercase
    - Remove special characters
    - Strip whitespace
    """
    if not isinstance(text, str):
        return ""
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s]", "", text)  # keep alphanumeric + spaces
    return text


def clean_numeric(value, default=0):
    """
    Clean numeric values (e.g., cost, ratings).
    - Convert to float if possible
    - Replace invalids with default
    """
    try:
        return float(value)
    except (ValueError, TypeError):
        return default


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    General dataframe cleaning.
    - Drop duplicates
    - Handle missing values
    - Normalize text columns
    """
    df = df.copy()
    df.drop_duplicates(inplace=True)

    # Fill missing values
    for col in df.select_dtypes(include="number").columns:
        df[col].fillna(df[col].mean(), inplace=True)
    for col in df.select_dtypes(include="object").columns:
        df[col].fillna("", inplace=True)
        df[col] = df[col].apply(clean_text)

    return df


def clean_data(data):
    """
    Main entry point for data cleaning.
    Accepts string, number, or DataFrame.
    """
    if isinstance(data, str):
        return clean_text(data)
    elif isinstance(data, (int, float)):
        return clean_numeric(data)
    elif isinstance(data, pd.DataFrame):
        return clean_dataframe(data)
    else:
        return data
