# Auto-generated from attention_analysis.ipynb
# Notebook outputs are not included.

# %%
#starting with the model K562_mismatch.pt
# ===============================
# 1. IMPORTS
# ===============================
import sys
sys.path.insert(0, "../app/ml")

# on importe les fonctions utiles du modèle DL
from dl_model import load_model, predict_with_attention

import matplotlib.pyplot as plt


# ===============================
# 2. CHARGER LE MODELE
# ===============================
# ici on charge un modèle déjà entraîné
model_path = "../models/K562_mismatch.pt"

model = load_model(model_path)

print(" Modèle chargé")


# ===============================
# 3. DEFINIR UNE PAIRE GUIDE / TARGET
# ===============================
#  IMPORTANT : séquences réalistes (longueur 23 pour mismatch)

guide = "GAGTCCGAGCAGAAGAAGAAGGG"   # exemple guide RNA
target = "GAGTCCGAGCAGAAGAAGAAGGA"  # cible (légèrement différente)


# ===============================
# 4. PREDICTION + ATTENTION
# ===============================
# cette fonction donne :
# - prob = probabilité off-target
# - attention = importance de chaque position
result = predict_with_attention(model, guide, target, mode="mismatch")

prob = result["prob"]
attention = result["attention"]

print(f" Probabilité off-target : {prob:.4f}")


# ===============================
# 5. VISUALISATION DE L’ATTENTION
# ===============================

plt.figure(figsize=(10, 4))

# tracer l'importance de chaque position
plt.plot(attention, marker="o")

plt.title("Importance des positions (attention)")
plt.xlabel("Position dans la séquence")
plt.ylabel("Importance")

plt.grid()
plt.show()
#Le modèle se concentre surtout sur la fin de la séquence pour prendre sa décision.
#Les dernières positions sont les plus importantes.
#Si quelque chose se passe à la fin de la séquence, c’est très important pour décider s’il y a un off-target.
#Le modèle identifie une zone biologiquement importante (fin de séquence) comme critique pour la décision.
#The model focuses mainly on the last positions of the sequence, indicating that this region plays a key role in predicting off-target effects.

# %%
#starting with the model K562Hek293_mismatch.pt
# ===============================
# 1. IMPORTS
# ===============================
import sys
sys.path.insert(0, "../app/ml")

# on importe les fonctions utiles du modèle DL
from dl_model import load_model, predict_with_attention

import matplotlib.pyplot as plt


# ===============================
# 2. CHARGER LE MODELE
# ===============================
# ici on charge un modèle déjà entraîné
model_path = "../models/K562Hek293_mismatch.pt"

model = load_model(model_path)

print(" Modèle chargé")


# ===============================
# 3. DEFINIR UNE PAIRE GUIDE / TARGET
# ===============================
#  IMPORTANT : séquences réalistes (longueur 23 pour mismatch)

guide = "GAGTCCGAGCAGAAGAAGAAGGG"   # exemple guide RNA
target = "GAGTCCGAGCAGAAGAAGAAGGA"  # cible (légèrement différente)


# ===============================
# 4. PREDICTION + ATTENTION
# ===============================
# cette fonction donne :
# - prob = probabilité off-target
# - attention = importance de chaque position
result = predict_with_attention(model, guide, target, mode="mismatch")

prob = result["prob"]
attention = result["attention"]

print(f"Probabilité off-target : {prob:.4f}")


# ===============================
# 5. VISUALISATION DE L’ATTENTION
# ===============================

plt.figure(figsize=(10, 4))

# tracer l'importance de chaque position
plt.plot(attention, marker="o")

plt.title("Importance des positions (attention)")
plt.xlabel("Position dans la séquence")
plt.ylabel("Importance")

plt.grid()
plt.show()

# %%
#starting with the model Hek293t_mismatch.pt
# ===============================
# 1. IMPORTS
# ===============================
import sys
sys.path.insert(0, "../app/ml")

# on importe les fonctions utiles du modèle DL
from dl_model import load_model, predict_with_attention

import matplotlib.pyplot as plt


# ===============================
# 2. CHARGER LE MODELE
# ===============================
# ici on charge un modèle déjà entraîné
model_path = "../models/Hek293t_mismatch.pt"

model = load_model(model_path)

print(" Modèle chargé")


# ===============================
# 3. DEFINIR UNE PAIRE GUIDE / TARGET
# ===============================
#  IMPORTANT : séquences réalistes (longueur 23 pour mismatch)

guide = "GAGTCCGAGCAGAAGAAGAAGGG"   # exemple guide RNA
target = "GAGTCCGAGCAGAAGAAGAAGGA"  # cible (légèrement différente)


# ===============================
# 4. PREDICTION + ATTENTION
# ===============================
# cette fonction donne :
# - prob = probabilité off-target
# - attention = importance de chaque position
result = predict_with_attention(model, guide, target, mode="mismatch")

prob = result["prob"]
attention = result["attention"]

print(f" Probabilité off-target : {prob:.4f}")


# ===============================
# 5. VISUALISATION DE L’ATTENTION
# ===============================

plt.figure(figsize=(10, 4))

# tracer l'importance de chaque position
plt.plot(attention, marker="o")

plt.title("Importance des positions (attention)")
plt.xlabel("Position dans la séquence")
plt.ylabel("Importance")

plt.grid()
plt.show()

# %%
#starting with the model GUIDE-Seq_indel.pt
# ===============================
# 1. IMPORTS
# ===============================
import sys
sys.path.insert(0, "../app/ml")

# on importe les fonctions utiles du modèle DL
from dl_model import load_model, predict_with_attention

import matplotlib.pyplot as plt


# ===============================
# 2. CHARGER LE MODELE
# ===============================
# ici on charge un modèle déjà entraîné
model_path = "../models/GUIDE-Seq_indel.pt"

model = load_model(model_path)

print(" Modèle chargé")


# ===============================
# 3. DEFINIR UNE PAIRE GUIDE / TARGET
# ===============================
#  IMPORTANT : séquences réalistes (longueur 23 pour mismatch)

guide = "GAGTCCGAGCAGAAGAAGAAGGG"   # exemple guide RNA
target = "GAGTCCGAGCAGAAGAAGAAGGA"  # cible (légèrement différente)


# ===============================
# 4. PREDICTION + ATTENTION
# ===============================
# cette fonction donne :
# - prob = probabilité off-target
# - attention = importance de chaque position
result = predict_with_attention(model, guide, target, mode="mismatch")

prob = result["prob"]
attention = result["attention"]

print(f" Probabilité off-target : {prob:.4f}")


# ===============================
# 5. VISUALISATION DE L’ATTENTION
# ===============================

plt.figure(figsize=(10, 4))

# tracer l'importance de chaque position
plt.plot(attention, marker="o")

plt.title("Importance des positions (attention)")
plt.xlabel("Position dans la séquence")
plt.ylabel("Importance")

plt.grid()
plt.show()

# %%
#starting with the model CIRCLE_seq_indel.pt
# ===============================
# 1. IMPORTS
# ===============================
import sys
sys.path.insert(0, "../app/ml")

# on importe les fonctions utiles du modèle DL
from dl_model import load_model, predict_with_attention

import matplotlib.pyplot as plt


# ===============================
# 2. CHARGER LE MODELE
# ===============================
# ici on charge un modèle déjà entraîné
model_path = "../models/CIRCLE_seq_indel.pt"

model = load_model(model_path)

print(" Modèle chargé")


# ===============================
# 3. DEFINIR UNE PAIRE GUIDE / TARGET
# ===============================
#  IMPORTANT : séquences réalistes (longueur 23 pour mismatch)

guide = "GAGTCCGAGCAGAAGAAGAAGGG"   # exemple guide RNA
target = "GAGTCCGAGCAGAAGAAGAAGGA"  # cible (légèrement différente)


# ===============================
# 4. PREDICTION + ATTENTION
# ===============================
# cette fonction donne :
# - prob = probabilité off-target
# - attention = importance de chaque position
result = predict_with_attention(model, guide, target, mode="mismatch")

prob = result["prob"]
attention = result["attention"]

print(f" Probabilité off-target : {prob:.4f}")


# ===============================
# 5. VISUALISATION DE L’ATTENTION
# ===============================

plt.figure(figsize=(10, 4))

# tracer l'importance de chaque position
plt.plot(attention, marker="o")

plt.title("Importance des positions (attention)")
plt.xlabel("Position dans la séquence")
plt.ylabel("Importance")

plt.grid()
plt.show()

