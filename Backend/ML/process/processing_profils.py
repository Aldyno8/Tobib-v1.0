import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from imblearn.over_sampling import RandomOverSampler
from sklearn.preprocessing import LabelEncoder

df = pd.read_csv('data.csv')
df = df[df["Outcome Variable"] == "Positive"]

x = df.drop(columns=["Disease"])
y = df["Disease"]

ros = RandomOverSampler(random_state=8)
x_resampled, y_resampled = ros.fit_resample(x, y)
df = pd.DataFrame(x_resampled, columns=x.columns)
df["Disease"] = y_resampled

df["Fever"] = df["Fever"].map({"No": 0, "Yes": 1})
df["Cough"] = df["Cough"].map({"No": 0, "Yes": 1})
df["Fatigue"] = df["Fatigue"].map({"No": 0, "Yes": 1})
df["Difficulty Breathing"] = df["Difficulty Breathing"].map({"No": 0, "Yes": 1})
df["Gender"] = df["Gender"].map({"Male": 0, "Female": 1})
ordre = {"low": 0, "Normal": 1, "High": 2}
df["Blood Pressure"] = df["Blood Pressure"].map(ordre)
df["Cholesterol Level"] = df["Cholesterol Level"].map(ordre)

label_encoder = LabelEncoder()
df["Disease"] = label_encoder.fit_transform(df["Disease"])
df_mapping = dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))
reverse_mapping = {v: k for k, v in df_mapping.items()}

x = df.drop(columns=["Disease", "Outcome Variable"])
y = df["Disease"]

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=8)
model = RandomForestClassifier(random_state=8)

param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [None, 10, 20],
    'min_samples_split': [2, 5],
    'min_samples_leaf': [1, 2],
    'class_weight': ['balanced', None]
}

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=8),
    param_grid,
    cv=5,
    scoring='f1_macro',
    n_jobs=-1
)

grid_search.fit(x_train, y_train)
model = grid_search.best_estimator_
print("Meilleurs paramètres trouvés :", grid_search.best_params_)

scores = cross_val_score(model, x_train, y_train, cv=5)
print(f"Cross-validation scores: {scores.mean()}")
y_predict_test = model.predict(x_test)
y_predict_train = model.predict(x_train)


# Evaluation du modèle par rapport à différents indicateurs
accuracy_score_test = accuracy_score(y_test, y_predict_test)
accuracy_score_train = accuracy_score(y_train, y_predict_train)

precision = precision_score(y_test, y_predict_test, average='macro', zero_division=1)
recall = recall_score(y_test, y_predict_test, average='macro', zero_division=1)
f1score = f1_score(y_test, y_predict_test, average='macro', zero_division=1)

print(f"Accuracy test: {accuracy_score_test}")
print(f"Accuracy: {accuracy_score_train}")
print(f"Precision: {precision}")
print(f"Recall: {recall}")
print(f"f1_score: {f1score}")
