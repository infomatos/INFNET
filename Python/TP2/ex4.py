dict1 = {'a': 1, 'b': 2}
dict2 = {'a': 1, 'b': 2, 'c': 3}
is_subset = all(item in dict2.items() for item in dict1.items())
print("SIM" if is_subset else "NÃO")
