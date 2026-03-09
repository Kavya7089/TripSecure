# feature_extraction.py
import numpy as np
from math import radians, sin, cos, sqrt, atan2

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000.0
    dlat = radians(lat2 - lat1); dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1))*cos(radians(lat2))*sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    return R * c

def extract_features(trip_df):
    lats = trip_df['lat'].values
    lons = trip_df['lon'].values
    speeds = trip_df['speed'].fillna(0).values
    times = pd.to_datetime(trip_df['timestamp']).values.astype('datetime64[s]').astype(int)

    # pairwise distances & time gaps
    dists=[0.0]
    time_gaps=[1]
    for i in range(1,len(lats)):
        d = haversine(lats[i-1], lons[i-1], lats[i], lons[i])
        dists.append(d)
        time_gaps.append(max(1, times[i]-times[i-1]))

    total_dist = sum(dists)    # meters
    avg_speed = np.mean(speeds) if len(speeds)>0 else 0
    max_speed = np.max(speeds) if len(speeds)>0 else 0

    # stationary time: sum of consecutive intervals where speed < 0.5 m/s
    stationary = 0
    for s,t in zip(speeds, time_gaps):
        if s < 0.5:
            stationary += t

    # check-in frequency
    checkins = trip_df['event'].eq('checkin').sum()

    # abrupt jump detection: large d/t
    jump_flag = any((np.array(dists) / np.array(time_gaps) > 30))  # >30 m/s unlikely

    features = {
        'total_distance_m' : total_dist,
        'avg_speed' : avg_speed,
        'max_speed' : max_speed,
        'stationary_time_s' : stationary,
        'num_points' : len(lats),
        'checkin_count' : checkins,
        'abrupt_jump' : int(jump_flag)
    }
    return features
