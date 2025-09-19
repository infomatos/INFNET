import pandas as pd

df = pd.read_csv("adult.csv", na_values="?")

df['marital_status_code'] = pd.factorize(df['marital-status'])[0]
print(df[['marital-status', 'marital_status_code']].head())
