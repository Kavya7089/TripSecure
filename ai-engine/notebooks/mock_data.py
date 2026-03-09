# ai-engine/notebooks/mock_data.py
import pandas as pd, numpy as np, datetime, random
def gen_trip(trip_id, start_lat, start_lon, n=100):
    ts = datetime.datetime.utcnow()
    pts=[]
    lat,lon = start_lat, start_lon
    for i in range(n):
        lat += np.random.normal(0, 0.0005)
        lon += np.random.normal(0, 0.0005)
        speed = abs(np.random.normal(1.2, 0.8))
        pts.append([trip_id, f"user_{random.randint(1,50)}", (ts + datetime.timedelta(seconds=30*i)).isoformat()+'Z', lat, lon, speed, "move"])
    return pd.DataFrame(pts, columns=['trip_id','tourist_id','timestamp','lat','lon','speed','event'])
df = pd.concat([gen_trip(f"trip_{i}", 26.8,80.9, n=80) for i in range(200)])
df.to_csv("mock_trips.csv", index=False)
