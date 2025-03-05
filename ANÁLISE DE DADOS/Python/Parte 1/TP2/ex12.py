import random
frutas = input("Digite a lista de frutas (separadas por vírgula): ").split(',')
quantidades = input("Digite a lista de quantidades (separadas por vírgula): ").split(',')
if len(quantidades) > len(frutas):
    quantidades = quantidades[:len(frutas)]
elif len(quantidades) < len(frutas):
    print("Quantidade insuficiente, forneça novamente.")
presente = random.choice(frutas).strip()
print(f"Você ganhou uma {presente} de presente!")
