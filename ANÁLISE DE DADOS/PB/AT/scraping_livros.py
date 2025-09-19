import requests
from bs4 import BeautifulSoup
import os
import pandas as pd
import sqlite3
from datetime import datetime


def scraping_livros(url='https://pedrovncs.github.io/livrariapython/livros.html'):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    todos_os_livros = []
    
    for div in soup.find_all('li'):
        try: # adição do try-except para captura de erros
            titulo = div.find('h5')
            if not titulo:
                continue

            titulo_texto = titulo.get_text(strip=True)
            livro = {'Título': titulo_texto}

            for p in div.find_all('p'):
                texto = p.get_text(strip=True)
                if ':' in texto:
                    chave, valor = texto.split(':', 1)
                livro[chave.strip()] = valor.strip()

            todos_os_livros.append(livro)

        except Exception as e:
            registrar_erro_scraping(
                titulo_texto if 'titulo_texto' in locals() else 'DESCONHECIDO',
            str(e)
)

    df = pd.DataFrame(todos_os_livros)

    # Formata a data
    def formatar_data(data_str):
        try:
            data_obj = datetime.strptime(data_str, '%d-%m-%Y')
            return data_obj.strftime('%Y-%m-%d')
        except:
            return None

    df['Data de publicação'] = df['Data de publicação'].apply(formatar_data)

    # Cria pasta dados se não existir
    os.makedirs("dados", exist_ok=True)
    df.to_csv("dados/df_livros.csv", index=False, encoding='utf-8-sig')
    print(f"✅ df_livros.csv salvo com {len(df)} livros.")

if __name__ == "__main__":
    scraping_livros()

# atualização do código para o registro de erros
def registrar_erro_scraping(titulo, erro_msg, banco='biblioteca.db'):
    conn = sqlite3.connect(banco)
    cursor = conn.cursor()
    data = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
        INSERT INTO ErrosScraping (titulo, erro, data_ocorrencia)
        VALUES (?, ?, ?)
    """, (titulo, erro_msg, data))

    conn.commit()
    conn.close()
    print(f"⚠️ Erro registrado para o livro: {titulo}")
