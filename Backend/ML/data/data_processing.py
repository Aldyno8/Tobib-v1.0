from sklearn.preprocessing import MultiLabelBinarizer, LabelEncoder
import pandas as pd

df = pd.read_csv("./ML/data/data3_process.csv")

df['Symptoms'] = df['Symptoms'].apply(lambda x: x.split(', '))

multi_encoder = MultiLabelBinarizer()
symptoms_encoded = multi_encoder.fit_transform(df['Symptoms'])

df_symptoms = pd.DataFrame(symptoms_encoded, columns=multi_encoder.classes_)

df_encoded = pd.concat([df['Disease'], df_symptoms], axis=1)

label_endcoder = LabelEncoder()
df_encoded['Disease'] = label_endcoder.fit_transform(df_encoded['Disease'])
print(df_encoded.head())

df_encoded.to_csv("./ML/data/data_final_encoded.csv", index=False)

disease_mapping = dict(zip(label_endcoder.classes_, label_endcoder.transform(label_endcoder.classes_)))
reverse_mapping = {v: k for k, v in disease_mapping.items()}


