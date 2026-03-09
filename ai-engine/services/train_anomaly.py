# train_anomaly.py
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
from preprocess import load_trip_csv, group_by_trip
from feature_extraction import extract_features

df = load_trip_csv("mock_trips.csv")
trips = group_by_trip(df)

# build feature matrix
X=[]
trip_ids=[]
for tid, tdf in trips.items():
    feat = extract_features(tdf)
    X.append(list(feat.values()))
    trip_ids.append(tid)
cols = list(feat.keys())
X = pd.DataFrame(X, columns=cols)

scaler = StandardScaler()
Xs = scaler.fit_transform(X)

clf = IsolationForest(n_estimators=200, contamination=0.02, random_state=42)
clf.fit(Xs)

joblib.dump(clf, "ai-engine/models/anomaly_model.pkl")
joblib.dump(scaler, "ai-engine/models/anomaly_scaler.pkl")
X.to_csv("ai-engine/models/training_features.csv", index=False)
print("Saved anomaly model + scaler")
