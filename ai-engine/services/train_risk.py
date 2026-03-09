# train_risk.py
import joblib, pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Use the features created previously; for demo we create synthetic labels:
X = pd.read_csv("ai-engine/models/training_features.csv")
# Synthetic rule for label: stationary_time>3600s or abrupt_jump -> high risk
y = ((X['stationary_time_s'] > 3600) | (X['abrupt_jump'] == 1)).astype(int)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
pipe = Pipeline([('scaler', joblib.load("ai-engine/models/anomaly_scaler.pkl")), ('clf', RandomForestClassifier(n_estimators=100, random_state=42))])
pipe.fit(X_train, y_train)
pred = pipe.predict(X_test)
print(classification_report(y_test, pred))

joblib.dump(pipe, "ai-engine/models/risk_model.pkl")
print("Saved risk model")
