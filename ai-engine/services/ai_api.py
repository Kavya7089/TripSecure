# ai_api.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib, pandas as pd
from utils.feature_extraction import extract_features
from utils.data_cleaning import clean_data

from typing import List, Dict
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # goes up to ai-engine/
MODEL_DIR = os.path.join(BASE_DIR, "models")

anomaly_clf = joblib.load(os.path.join(MODEL_DIR, "anomaly_model.pkl"))
risk_clf = joblib.load(os.path.join(MODEL_DIR, "risk_score_model.pkl"))


app = FastAPI()


class Point(BaseModel):
    timestamp: str
    lat: float
    lon: float
    speed: float = 0.0
    event: str = "move"

class TripPayload(BaseModel):
    trip_id: str
    tourist_id: str
    points: List[Point]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict_anomaly")
def predict_anomaly(payload: TripPayload):
    import pandas as pd
    df = pd.DataFrame([p.dict() for p in payload.points])
    feat = extract_features(df)
    X = pd.DataFrame([list(feat.values())], columns=list(feat.keys()))
    Xs = scaler.transform(X)
    score = anomaly_clf.decision_function(Xs)[0]   # higher = normal, lower = anomalous
    label = int(anomaly_clf.predict(Xs)[0] == -1)
    return {"trip_id": payload.trip_id, "anomaly": bool(label), "anomaly_score": float(-score), "features": feat}

@app.post("/risk_score")
def risk_score(payload: TripPayload):
    import pandas as pd
    df = pd.DataFrame([p.dict() for p in payload.points])
    feat = extract_features(df)
    X = pd.DataFrame([list(feat.values())], columns=list(feat.keys()))
    prob = risk_pipe.predict_proba(X)[0][1] if hasattr(risk_pipe, "predict_proba") else float(risk_pipe.predict(X)[0])
    return {"trip_id": payload.trip_id, "risk_score": float(prob), "features": feat}
