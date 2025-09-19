# 2. ====SEGUNDA ETAPA: PRÁTICA====
import requests
from bs4 import BeautifulSoup
import pandas as pd

# 1. EXTRAIR OS FILMES DO RANKING IMDb
#a. acessar a página top 250

headers = {'User-Agent': 'Mozilla/5.0 Chrome/91.0.4472.124 Safari/537.36'}

url = "https://www.imdb.com/chart/top/"

print("Acessando o IMDb...")
response = requests.get(url, headers=headers, timeout=10)
response.raise_for_status()
print('Conectado.\n')

print("Analisando o conteúdo...")
soup = BeautifulSoup(response.text, 'html.parser')
filmes = soup.select('li.ipc-metadata-list-summary-item')

top_10 = [movie.text for movie in filmes[:10]]
print("\nTop 10 filmes do IMDb:")
for i, title in enumerate(top_10, 1):
    print(f"{title}")

# Separando título, ano e nota
filmes_processados = []

for filme in top_10:
    partes = filme.split('.')  # separa o número inicial
    if len(partes) > 1:
        resto = partes[1].strip()  # remove espaços antes do título
        # separar ano (últimos 4 dígitos numéricos antes da nota)
        ano = resto[-9:-5]  # pega os 4 caracteres antes do espaço e da nota
        nota = resto[-3:]  # últimos 3 caracteres, ex: '9.2'
        titulo = resto[:-9].strip()  # todo o resto antes do ano
        filmes_processados.append((titulo, ano, nota))

# Exibir o resultado
print("\nFilmes processados:")
for titulo, ano, nota in filmes_processados:
    print(f"{titulo}, Ano: {ano}, Nota: {nota}")
