from feature_extraction import extract_features
import pandas as pd
def test_stationary_trip():
    df = pd.DataFrame({
        'timestamp': ["2025-01-01T00:00:00Z","2025-01-01T00:10:00Z"],
        'lat':[26.8,26.8], 'lon':[80.9,80.9], 'speed':[0.0,0.0], 'event':['move','move']
    })
    f = extract_features(df)
    assert f['total_distance_m'] == 0
    assert f['stationary_time_s'] >= 600
