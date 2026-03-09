# preprocess.py
import pandas as pd
from datetime import datetime

def load_trip_csv(path):
    df = pd.read_csv(path, parse_dates=['timestamp'])
    df.sort_values(['trip_id','timestamp'], inplace=True)
    return df

def group_by_trip(df):
    trips = {}
    for trip_id, g in df.groupby('trip_id'):
        trips[trip_id] = g.reset_index(drop=True)
    return trips
