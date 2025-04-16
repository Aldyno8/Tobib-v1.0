import pandas as pd
import seaborn as sns
import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt 
import matplotlib.ticker as ticker
import numpy as np

df = pd.read_csv("data.csv")
print (" fievre yes",(df["Fever"] == "Yes").sum())
print (f" fievre No",(df["Fever"] == "No").sum())


def visualise_data(df):
    fig, ax = plt.subplots(figsize=(20, 10))
    sns.countplot(data=df, x=df["Fever"], hue=df['Disease'])
    plt.title("Relation entre Fever et Disease")
    plt.xlabel("Disease")
    plt.ylabel("Nombre d'occurrences")
    plt.xticks(rotation=45)
    plt.legend(title="Fever")
    plt.show()


visualise_data(df)


