import pandas as pd
import sqlite3
import os

# 1. Carregar e explorar dados =======
try: 
    df = pd.read_csv('Superstore.csv', encoding='latin1')
except FileNotFoundError:
    print("Arquivo não encontrado. Verifique o nome do arquivo.")
    df = pd.DataFrame()

print("\n>> Primeiras 5 linhas:")
print(df.head())
    
print("\n>> Tipos de colunas:")
print(df.dtypes)

print("\n>> Dimensões do DataFrame:")
print(df.shape)

print("\n>> Colunas com valores nulos:")
print(df.isnull().sum())

# 2. Manipulação de arquivos Excel ======

# Salve o dataset em um arquivo Excel e carregue-o novamente.
df.to_excel('Superstore_exl.xlsx', index=False)
try:
    df = pd.read_excel('Superstore_exl.xlsx')
except FileNotFoundError:
    print("Arquivo não encontrado. Verifique o nome do arquivo.")
    df = pd.DataFrame()
# Combine dois arquivos Excel contendo pedidos de anos diferentes usando pd.concat().
df['Order Date'] = pd.to_datetime(df["Order Date"])

# Pedidos de 2015 e 2017
df_2015 = df[df["Order Date"].dt.year == 2015]
df_2017 = df[df["Order Date"].dt.year == 2017]

# Salvando arquivos
df_2015.to_excel('Superstore_2015.xlsx', index=False)
df_2017.to_excel('Superstore_2017.xlsx', index=False)

# lendo arquivos..
try:
    df_2015_ = pd.read_excel('Superstore_2015.xlsx')
except FileNotFoundError:
    print("Arquivo não encontrado. Verifique o nome do arquivo.")
    df_2015_ = pd.DataFrame()
try:
    df_2017_ = pd.read_excel('Superstore_2017.xlsx')
except FileNotFoundError:
    print("Arquivo não encontrado. Verifique o nome do arquivo.")
    df_2017_ = pd.DataFrame()

# recombinando atos..
df_combinada = pd.concat([df_2015_, df_2017_], ignore_index=True)
print('\n')
print('Tabelas concatenadas: ')
print('\n')
print(df_combinada)

# 3. Integração com SQL (SQLite) ========

# Criar banco SQLite
conexao = sqlite3.connect('superstore.db')

# Criar tabela 'Pedidos'
cursor = conexao.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS pedidos (
        row_id INTEGER,
        order_id TEXT,
        order_date TEXT,
        ship_date TEXT,
        ship_mode TEXT,
        customer_id TEXT,
        customer_name TEXT,
        segment TEXT,
        country TEXT,
        city TEXT,
        state TEXT,
        postal_code INTEGER,
        region TEXT,
        product_id TEXT,
        category TEXT,
        sub_category TEXT,
        product_name TEXT,
        sales REAL,
        quantity INTEGER,
        discount REAL,
        profit REAL
    )
''')

# Recarregar o DataFrame
df = pd.read_excel('Superstore_exl.xlsx')
df['Order Date'] = pd.to_datetime(df['Order Date'])

# Inserir os dados na tabela 'pedidos'
df.to_sql('pedidos', conexao, if_exists='replace', index=False)

# Ler alguns dados da tabela
df_sql = pd.read_sql_query("SELECT * FROM pedidos LIMIT 5", conexao)

print('\n')
print('Exemplo SQL: ')
print('\n')
print(df_sql.head())

# 4. Consultas SQL básicas =========

# Listar os pedidos com lucro maior que 100
lucro_maior_100 = pd.read_sql_query("SELECT * FROM pedidos WHERE Profit > 100", conexao)
print('\n')
print('Relação das contas com lucro acima de 100 reais:')
print(lucro_maior_100)

# Filtrar os pedidos com seguimento consumer
seguimento_consumer = pd.read_sql_query("SELECT * FROM pedidos WHERE Segment = 'Consumer'", conexao)
print('\n')
print('Pedidos do seguimento Consumer:')
print(seguimento_consumer)

# 5 Consultas SQL avançadas

produtos_mais_vendidos = pd.read_sql_query(
        "SELECT `Product Name`, SUM(Quantity) as total_quantidade FROM pedidos GROUP BY `Product Name` ORDER BY total_quantidade DESC LIMIT 5", conexao)
print('\n')
print('5 Produtos mais vendidos:')
print(produtos_mais_vendidos)

cidade_mais_vendas = pd.read_sql_query(
        "SELECT City, SUM(Sales) as total_vendas FROM pedidos GROUP BY City ORDER BY total_vendas DESC LIMIT 1", conexao)
print('\n')
print('vendas por cidades:')
print(cidade_mais_vendas)

# 6. Atualização e exclusão no banco
cursor = conexao.cursor()
cursor.execute("DELETE FROM pedidos WHERE Sales < 50")
cursor.execute('ALTER TABLE pedidos ADD COLUMN "Order Status" TEXT')
cursor.execute("UPDATE pedidos SET `Order Status` = 'Pedido em Revisão' WHERE Quantity > 10")
conexao.commit()

# 7. Criação de colunas e transformações
df_combinada['Total com desconto'] = df_combinada['Sales'] - (df_combinada['Sales'] * df_combinada['Discount'])
df_combinada.fillna(value={'Customer Name': 'Não Informado', 'Sales': 0, 'Profit': 0}, inplace=True)
df_ordenado = df_combinada.sort_values(by='Sales', ascending=False)

# 8. Agrupamento e estatísticas
media_vendas_por_cidade = df_combinada.groupby('City')['Sales'].mean().reset_index()
print('\n')
print('media de vendas por cidades:')
print(media_vendas_por_cidade)

# 9. Tratamento de erros – Arquivo inexistente
try:
    df_fake = pd.read_csv('arquivo_inexistente.csv')
except FileNotFoundError:
    print("Arquivo não encontrado. Favor verifique o nome ou o caminho especificado")

# 10. Tratamento de valores inválidos
if (df_combinada['Quantity'] == 'xuxu').any():
    print("Alerta: Há valores negativos em 'Quantity'. Corrigindo para 0.")
    df_combinada.loc[df_combinada['Quantity'] < 0, 'Quantity'] = 0

# 11. Bloco ‘else’ em exceções
try:
    df_ok = pd.read_csv('Superstore.csv')
except Exception as e:
    print(f"Erro: {e}")
else:
    print("Arquivo carregado com sucesso!")

# 12. Tratamento de FileNotFoundError
try:
    pd.read_csv('dados_inexistentes.csv')
except FileNotFoundError:
    print("Arquivo não encontrado. Verifique o nome do arquivo.")

# 13. Uso de pass para silenciar falhas
try:
    pd.read_csv('talvez_exista.csv')
except:
    pass  # Ignora o erro e segue

# 14. Exportação de resultados
pedidos_lucrativos = df_combinada[df_combinada['Profit'] > 0]
pedidos_lucrativos.to_csv('pedidos_lucrativos.csv', index=False)

# 15. Automação de análise de vendas
try:
    vendas_por_cidade = pedidos_lucrativos.groupby('City')['Sales'].sum().reset_index()
    vendas_por_cidade.to_csv('resumo_vendas.csv', index=False)
    print('\n')
    print(vendas_por_cidade)
    print('\n')
except Exception as e:
    print("Erro ao gerar resumo de vendas:", e)

# 16. Relatório dinâmico com abas por categoria
try:
    with pd.ExcelWriter('relatorio_vendas.xlsx') as writer:
        for categoria, df_cat in df_combinada.groupby('Category'):
            df_cat.to_excel(writer, sheet_name=categoria[:31], index=False)

except Exception as e:
    print("Erro ao gerar relatório:", e)

conexao.close()