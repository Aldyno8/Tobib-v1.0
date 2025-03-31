import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv("./ML/data/data_3.csv")
df = df.drop(columns=['Code'])

def data_exploratory(df):
	print("En tête du dataset")
	print(df.head())
	print("\n")
	print("Taille du dataset")
	print(df.shape)
	print("\n")
	print("Informations sur le dataset")
	print(df.info())
	print("\n")
	print("Description du dataset")
	print(df.describe())
	print("\n")
	print("Valeurs manquantes")
	print(df.isnull().sum())

# plt.figure(figsize=(10,6))
# sns.heatmap(df.isnull(), cmap="viridis", cbar=True, yticklabels=True)
# plt.show()

for col in df.select_dtypes(include=['object']).columns:
    plt.figure(figsize=(8,4))
    sns.countplot(y=df[col], order=df[col].value_counts().index)
    plt.show()
	
data_exploratory(df)