import random
numero_magico = random.randint(1, 20)
tentativas = 4
while tentativas > 0:
    palpite = int(input("Adivinhe o número mágico entre 1 e 20: "))
    if palpite == numero_magico:
        print("Parabéns! Você acertou!")
        break
    elif palpite < numero_magico:
        print("Muito baixo!")
    else:
        print("Muito alto!")
    tentativas -= 1
if tentativas == 0:
    print("Suas tentativas acabaram! O número era:", numero_magico)
