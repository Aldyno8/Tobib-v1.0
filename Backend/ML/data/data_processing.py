import pandas as pd

df = pd.read_csv("./ML/data/data_3.csv")

df['Symptoms'] = df.iloc[:, 1:].apply(lambda x: ', '.join(x.dropna().astype(str)), axis=1)

df_transformed = df[['Disease', 'Symptoms']]

df_transformed.to_csv("./ML/data/data3_process.csv", index=False)


