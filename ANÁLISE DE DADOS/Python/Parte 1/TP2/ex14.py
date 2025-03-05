def dividir(a, b):
    quociente = a // b
    resto = a % b
    return quociente, resto

resultado = dividir(10, 3)
print("Quociente:", resultado[0], "Resto:", resultado[1])
