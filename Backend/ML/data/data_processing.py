from sklearn.preprocessing import MultiLabelBinarizer, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pandas as pd

# Encodage des données
df = pd.read_csv("./ML/data/data_3.csv")
print("before",df.shape, "\n")
df = df.dropna(axis=0)
print("after",df.shape)

df['Symptoms'] = df['Symptoms'].apply(lambda x: x.split(', '))
df['Treatments'] = df['Treatments'].apply(lambda x: x.split(', '))
multi_encoder = MultiLabelBinarizer(handle_unknown='ignore')


symptoms_encoded = multi_encoder.fit_transform(df['Symptoms'])
treatments_encoded = multi_encoder.fit_transform(df['Treatments'])
print(len(multi_encoder.classes_)) 

symptoms_encoded.reset_index(drop=True)  
df_symptoms = pd.DataFrame(symptoms_encoded, columns=multi_encoder.classes_)

df_encoded = pd.concat([df['Name'], df_symptoms], treatments_encoded, axis=1)
print(df_encoded)

label_endcoder = LabelEncoder()
# df_encoded['Disease'] = label_endcoder.fit_transform(df_encoded['Disease'])


# disease_mapping = dict(zip(label_endcoder.classes_, label_endcoder.transform(label_endcoder.classes_)))
# reverse_mapping = {v: k for k, v in disease_mapping.items()}

# Entrainement du modeles
# x = df_encoded.drop(columns=['Disease'])
# y = df_encoded['Disease']

# X_unique = x.drop_duplicates()
# y_unique = y.loc[X_unique.index] 

# x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42, stratify=y)

# model = RandomForestClassifier()
# model.fit(x_train, y_train)

# y_predict_test = model.predict(x_test)
# y_predict_train = model.predict(x_train)

# accuracy_score_test = accuracy_score(y_test, y_predict_test)
# accuracy_score_train = accuracy_score(y_train, y_predict_train)

# print(f"Accuracy: {accuracy_score_test}")
# print(f"Accuracy: {accuracy_score_train}")

# duplicates = x_train.merge(x_test, how='inner')
# print(f"Nombre de doublons entre train et test : {len(duplicates)}")
