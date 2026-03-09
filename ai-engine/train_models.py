import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest, RandomForestRegressor
from sklearn.model_selection import train_test_split

# -----------------------------
# Create synthetic dataset
# -----------------------------

# Example anomaly detection data (1000 samples, 5 features)
X = np.random.randn(1000, 5)

# Example risk scoring dataset
data = pd.DataFrame({
    "age": np.random.randint(18, 70, 1000),
    "days_travel": np.random.randint(1, 30, 1000),
    "locations": np.random.randint(1, 10, 1000),
    "budget": np.random.randint(100, 10000, 1000),
})
data["risk_score"] = (
    0.3 * data["age"] +
    0.5 * data["days_travel"] +
    0.2 * data["locations"] +
    np.random.randn(1000) * 5
)

# -----------------------------
# Train Anomaly Detection Model
# -----------------------------
print("[INFO] Training Anomaly Detection Model...")
anomaly_model = IsolationForest(contamination=0.05, random_state=42)
anomaly_model.fit(X)

# -----------------------------
# Train Risk Score Prediction Model
# -----------------------------
print("[INFO] Training Risk Score Model...")
X_train, X_test, y_train, y_test = train_test_split(
    data.drop("risk_score", axis=1),
    data["risk_score"],
    test_size=0.2,
    random_state=42
)

risk_model = RandomForestRegressor(n_estimators=100, random_state=42)
risk_model.fit(X_train, y_train)

# -----------------------------
# Save Models
# -----------------------------
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(anomaly_model, os.path.join(MODEL_DIR, "anomaly_model.pkl"))
joblib.dump(risk_model, os.path.join(MODEL_DIR, "risk_score_model.pkl"))

print("[INFO] Models saved in:", MODEL_DIR)
