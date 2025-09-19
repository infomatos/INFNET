# 2. ====SEGUNDA ETAPA: PRÁTICA====
import requests
from bs4 import BeautifulSoup
import pandas as pd

# 1. EXTRAIR OS FILMES DO RANKING IMDb
#a. acessar a página top 250

headers = {'User-Agent': 'Mozilla/5.0 Chrome/91.0.4472.124 Safari/537.36'}

url = "https://www.imdb.com/chart/top/"

print("\nAcessando o IMDb...")
response = requests.get(url, headers=headers, timeout=10)
response.raise_for_status()

print("Analisando o conteúdo...")
soup = BeautifulSoup(response.text, 'html.parser')
balaio_de_gato = soup.select('li.ipc-metadata-list-summary-item')

#b. Extraia os títulos dos filmes e exiba os 10 primeiros
movies = []
for container in balaio_de_gato[:10]:
    try:
    # Extrair título
        titulo_elem = container.select_one('h3.ipc-title__text')
        titulo = titulo_elem.text.split('. ')[1] if titulo_elem else "N/A"          
        
        movies.append({
            'titulo': titulo.strip()
                })
    except Exception as e:
        print(f"Erro ao processar um filme: {e}")
    continue

print("\nTop 10 filmes do IMDb:\n")
for i, movie in enumerate(movies, 1):
    print(f"{i}. {movie['titulo']}")

#2. EXTRAIA TÍTULO, ANO E NOTA

#a. Extraia o título do filme, o ano de lançamento e a nota no IMDb
balaio_de_gato = soup.select('li.ipc-metadata-list-summary-item')
movies = []
for container in balaio_de_gato[:10]:
    try:
    # Extrair título
        titulo_elem = container.select_one('h3.ipc-title__text')
        titulo = titulo_elem.text.split('. ')[1] if titulo_elem else "N/A"          
    # Extrair ano
        year_elem = container.find_all('span', class_='cli-title-metadata-item')[0]
        ano = year_elem.text if year_elem else "Ano desconhecido"       
    # Extrair avaliação
        nota_elem = container.select_one('span.ipc-rating-star.ipc-rating-star--base.ipc-rating-star--imdb')
        nota = float(nota_elem.text.split()[0]) if nota_elem else 0.0
                
        movies.append({
            'titulo': titulo.strip(),
             'ano': ano.strip(),
            'nota': nota
                })
    except Exception as e:
        print(f"Erro ao processar um filme: {e}")
    continue

#b. Exiba os 5 primeiros filmes formatados.
print("\nTop 5 melhores com ano e nota:\n")
for i, movie in enumerate(movies[:5], 1):
    print(f"{i}. {movie['titulo']} ({movie['ano']}) - Nota: {movie['nota']}")

# 3. Criar a classe base TV e as classes Movie e Series:
#a. 
class TV:
    def __init__(self, title, year):
        self.title = title
        self.year = year

class Movie(TV):
    def __init__(self, title, year, rating):
        super().__init__(title, year)
        self.rating = float(rating)

    def __str__(self):
        return f"{self.title} ({self.year}) - Nota: {self.rating}"

class Series(TV):
    def __init__(self, title, year, seasons, episodes):
        super().__init__(title, year)
        self.seasons = seasons
        self.episodes = episodes

    def __str__(self):
        return f"{self.title} ({self.year}) - {self.seasons} temporada(s), {self.episodes} episódio(s)"
    
# 4. Criar uma lista de objetos Movie e Series a partir de scraping:

# a e b. Criando objetos Movie com base no scraping
movie_list = []
for movie in movies:
    movie_obj = Movie(movie['titulo'], int(movie['ano']), movie['nota'])
    movie_list.append(movie_obj)

# c. Criar 2 séries manualmente
serie1 = Series("Smallville", 2001, 10, 234)
serie2 = Series("Stranger Things", 2016, 4, 34)

# d. Lista geral e exibição
tv_list = movie_list + [serie1, serie2]

print("\nTodos os objetos formatados:\n")
for item in tv_list:
    print(item)
print('\n')

# 5. Criar banco SQLite com SQLAlchemy
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///imdb.db')
Base = declarative_base()

# b. Tabela Movie
class MovieDB(Base):
    __tablename__ = 'movies'
    id = Column(Integer, primary_key=True)
    title = Column(String, unique=True)
    year = Column(Integer)
    rating = Column(Float)

# c. Tabela Series
class SeriesDB(Base):
    __tablename__ = 'series'
    id = Column(Integer, primary_key=True)
    title = Column(String, unique=True)
    year = Column(Integer)
    seasons = Column(Integer)
    episodes = Column(Integer)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# d e. Inserção com proteção contra duplicatas
for m in movie_list:
    try:
        filme = MovieDB(title=m.title, year=int(m.year), rating=m.rating)
        session.add(filme)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Filme duplicado ou erro: {m.title} - {e}")

for s in [serie1, serie2]:
    try:
        serie = SeriesDB(title=s.title, year=int(s.year), seasons=s.seasons, episodes=s.episodes)
        session.add(serie)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Série duplicada ou erro: {s.title} - {e}")

# 6. Consulta com Pandas
import pandas as pd

try:
    movies_df = pd.read_sql("SELECT * FROM movies", engine)
    series_df = pd.read_sql("SELECT * FROM series", engine)

    print("\nFilmes do banco de dados:")
    print(movies_df.head())

    print("\nSéries do banco de dados:")
    print(series_df.head())

except Exception as e:
    print(f"Erro ao consultar o banco: {e}")


# 7. Análise com Pandas
# a. Ordenar do maior para o menor
top_rated = movies_df.sort_values(by="rating", ascending=False)

# b. Filtrar rating > 9.0
top_above_9 = top_rated[top_rated["rating"] > 9.0]

# c. Mostrar os 5 melhores
print("\nTop 5 filmes com nota acima de 9.0:")
print(top_above_9.head())


# 8. Exportação para CSV e JSON
try:
    movies_df.to_csv("movies.csv", index=False)
    series_df.to_csv("series.csv", index=False)

    movies_df.to_json("movies.json", orient="records", indent=4)
    series_df.to_json("series.json", orient="records", indent=4)

    print("\nExportação realizada com sucesso!")
except Exception as e:
    print(f"Erro ao exportar: {e}")
