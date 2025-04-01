from sklearn.preprocessing import MultiLabelBinarizer, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from imblearn.over_sampling import RandomOverSampler
from sklearn.metrics import precision_score, recall_score
from deep_translator import GoogleTranslator
import pandas as pd
import numpy as np

df = pd.read_csv("./ML/data/data_3.csv")
df = df.dropna(axis=0)


X = df.drop('Name', axis=1)
y = df['Name']

ros = RandomOverSampler(random_state=42)

X_resampled, y_resampled = ros.fit_resample(X, y)

df = pd.DataFrame(X_resampled, columns=X.columns)
df['Name'] = y_resampled


df['Symptoms'] = df['Symptoms'].apply(lambda x: x.split(', '))
df['Treatments'] = df['Treatments'].apply(lambda x: x.split(', '))

multi_encoder = MultiLabelBinarizer()

# treatments_encoded = multi_encoder.fit_transform(df['Treatments'])
# treatments_dataframe = pd.DataFrame(treatments_encoded, columns=multi_encoder.classes_)

symptoms_encoded = multi_encoder.fit_transform(df['Symptoms'])
symptoms_dataframe = pd.DataFrame(symptoms_encoded, columns=multi_encoder.classes_)

new_df = pd.concat([df['Name'], symptoms_dataframe], axis=1)

label_endcoder = LabelEncoder()
new_df['Name'] = label_endcoder.fit_transform(new_df['Name'])

df_mapping = dict(zip(label_endcoder.classes_, label_endcoder.transform(label_endcoder.classes_)))
reverse_mapping = {v: k for k, v in df_mapping.items()}

x = new_df.drop(columns=['Name'])
y = new_df['Name']

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(random_state=42)
model.fit(x_train, y_train)

y_predict_test = model.predict(x_test)
y_predict_train = model.predict(x_train)

accuracy_score_test = accuracy_score(y_test, y_predict_test)
accuracy_score_train = accuracy_score(y_train, y_predict_train)

precision = precision_score(y_test, y_predict_test, average='macro', zero_division=1)
recall = recall_score(y_test, y_predict_test, average='macro', zero_division=1)


print(f"Accuracy test: {accuracy_score_test}")
print(f"Accuracy: {accuracy_score_train}")
print(f"Precision: {precision}")
print(f"Recall: {recall}")


def test():
    symptoms = ['Motor', 'cognitive',]
    test = pd.DataFrame(symptoms)
    test = multi_encoder.transform([symptoms])
    prediction = model.predict(test)
    translator = GoogleTranslator(source='en', target='fr')
    
    print(translator.translate(reverse_mapping[prediction[0]]))

print("\n")
test()  