"""
16 MBTI types mapped to their ideal cognitive function stacks (8D vectors).

Each vector represents normalized weights [Se, Si, Ne, Ni, Te, Ti, Fe, Fi]
The dominant function gets weight 4, auxiliary 3, tertiary 2, inferior 1.
The remaining 4 shadow functions get weight 0.
"""

# Function indices in the 8D vector
FUNC_IDX = {
    "Se": 0, "Si": 1, "Ne": 2, "Ni": 3,
    "Te": 4, "Ti": 5, "Fe": 6, "Fi": 7,
}

FUNC_NAMES = ["Se", "Si", "Ne", "Ni", "Te", "Ti", "Fe", "Fi"]

# Each type: [Se, Si, Ne, Ni, Te, Ti, Fe, Fi] — ideal stack weights
TYPE_TEMPLATES = {
    "INTJ": [0, 0, 0, 4, 0, 0, 0, 3],  # Ni > Te > Fi > Se
    "INTP": [0, 0, 0, 0, 0, 4, 0, 0],  # Ti > Ne > Si > Fe  (will be overridden)
    "INFJ": [0, 0, 0, 4, 0, 0, 3, 0],  # Ni > Fe > Ti > Se
    "INFP": [0, 0, 0, 0, 0, 0, 0, 4],  # Fi > Ne > Si > Te
    "ISTJ": [0, 4, 0, 0, 3, 0, 0, 1],  # Si > Te > Fi > Ne
    "ISFJ": [0, 4, 0, 0, 0, 0, 3, 1],  # Si > Fe > Ti > Ne
    "ISTP": [0, 0, 0, 0, 0, 4, 0, 0],  # Ti > Se > Ni > Fe
    "ISFP": [0, 0, 0, 0, 0, 0, 0, 4],  # Fi > Se > Ni > Te
    "ENTJ": [0, 0, 0, 0, 4, 0, 0, 3],  # Te > Ni > Se > Fi
    "ENTP": [0, 0, 4, 0, 0, 3, 1, 0],  # Ne > Ti > Fe > Si
    "ENFJ": [0, 0, 0, 0, 0, 0, 4, 3],  # Fe > Ni > Se > Ti
    "ENFP": [0, 0, 4, 0, 0, 0, 0, 3],  # Ne > Fi > Te > Si
    "ESTJ": [0, 0, 0, 0, 4, 0, 0, 0],  # Te > Si > Ne > Fi
    "ESFJ": [0, 0, 0, 0, 0, 0, 4, 0],  # Fe > Si > Ne > Ti
    "ESTP": [4, 0, 0, 0, 0, 3, 0, 0],  # Se > Ti > Fe > Ni
    "ESFP": [4, 0, 0, 0, 0, 0, 0, 3],  # Se > Fi > Te > Ni
}

# Full templates with all 4 stack positions
TYPE_FULL_TEMPLATES = {
    "INTJ": [1, 0, 0, 4, 3, 0, 0, 2],  # Ni(4) > Te(3) > Fi(2) > Se(1)
    "INTP": [0, 1, 3, 0, 0, 4, 2, 0],  # Ti(4) > Ne(3) > Si(2) > Fe(1)
    "INFJ": [1, 0, 0, 4, 0, 2, 3, 0],  # Ni(4) > Fe(3) > Ti(2) > Se(1)
    "INFP": [0, 1, 3, 0, 1, 0, 0, 4],  # Fi(4) > Ne(3) > Si(2) > Te(1)
    "ISTJ": [1, 4, 0, 0, 3, 0, 0, 2],  # Si(4) > Te(3) > Fi(2) > Ne(1)
    "ISFJ": [1, 4, 0, 0, 0, 2, 3, 0],  # Si(4) > Fe(3) > Ti(2) > Ne(1)
    "ISTP": [3, 0, 0, 1, 0, 4, 0, 0],  # Ti(4) > Se(3) > Ni(2) > Fe(1)
    "ISFP": [3, 0, 0, 1, 2, 0, 0, 4],  # Fi(4) > Se(3) > Ni(2) > Te(1)
    "ENTJ": [2, 0, 1, 3, 4, 0, 0, 0],  # Te(4) > Ni(3) > Se(2) > Fi(1)
    "ENTP": [1, 0, 4, 0, 0, 3, 2, 0],  # Ne(4) > Ti(3) > Fe(2) > Si(1)
    "ENFJ": [2, 0, 1, 3, 0, 0, 4, 0],  # Fe(4) > Ni(3) > Se(2) > Ti(1)
    "ENFP": [1, 0, 4, 0, 2, 0, 0, 3],  # Ne(4) > Fi(3) > Te(2) > Si(1)
    "ESTJ": [2, 3, 1, 0, 4, 0, 0, 0],  # Te(4) > Si(3) > Se(2) > Ne(1)
    "ESFJ": [2, 3, 1, 0, 0, 0, 4, 0],  # Fe(4) > Si(3) > Se(2) > Ne(1)
    "ESTP": [4, 0, 0, 1, 0, 3, 0, 2],  # Se(4) > Ti(3) > Fe(2) > Ni(1)
    "ESFP": [4, 0, 0, 1, 2, 0, 0, 3],  # Se(4) > Fi(3) > Te(2) > Ni(1)
}
