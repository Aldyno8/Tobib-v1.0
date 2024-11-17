import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib

# Charger les données
data = pd.read_csv('ffake_health_data.csv')

# Encodage des variables catégorielles
label_encoder = LabelEncoder()
data['sex'] = label_encoder.fit_transform(data['sex'])  # M -> 0, F -> 1
data['smoker'] = label_encoder.fit_transform(data['smoker'])  # Yes -> 1, No -> 0
data['medical_history'] = label_encoder.fit_transform(data['medical_history'])  # Encoding pour l'historique médical

# Appliquer One-Hot Encoding sur les symptômes (colonne de texte)
if 'symptoms' in data.columns:
    symptoms = data['symptoms'].str.split(', ', expand=True).stack().unique()
    for symptom in symptoms:
        data[symptom] = data['symptoms'].apply(lambda x: 1 if symptom in x else 0)
    data.drop(columns=['symptoms'], inplace=True)  # Supprimer la colonne 'symptoms' d'origine

# Normalisation des caractéristiques numériques
scaler = StandardScaler()
data[['age', 'weight', 'exercise_frequency', ]] = scaler.fit_transform(
    data[['age', 'weight', 'exercise_frequency',]]
)

# Séparer les caractéristiques et l'étiquette cible
X = data.drop(columns=['maladie_possible'])
y = data['maladie_possible']

# Division des données en ensembles d’entraînement et de test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialiser et entraîner le modèle de forêt aléatoire
model = RandomForestClassifier(n_estimators=100, max_depth=10, min_samples_split=5, random_state=42)
model.fit(X_train, y_train)

# Évaluer les performances avec la validation croisée
cv_scores = cross_val_score(model, X_train, y_train, cv=5)
print(f"Score de validation croisée : {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# Faire des prédictions sur les données de test
y_pred = model.predict(X_test)

# Afficher les performances
print("Précision :", accuracy_score(y_test, y_pred))
print("Rapport de classification :\n", classification_report(y_test, y_pred))

print(data)
# joblib.dump(model, 'model_health_assistant.pkl')

