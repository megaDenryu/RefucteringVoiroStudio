from pathlib import Path
from enum import Enum

class Drive(Enum):
    A = Path("A:/")
    B = Path("B:/")
    C = Path("C:/")
    D = Path("D:/")
    E = Path("E:/")
    F = Path("F:/")
    G = Path("G:/")
    H = Path("H:/")
    I = Path("I:/")
    J = Path("J:/")
    K = Path("K:/")
    L = Path("L:/")
    M = Path("M:/")
    N = Path("N:/")
    O = Path("O:/")
    P = Path("P:/")
    Q = Path("Q:/")
    R = Path("R:/")
    S = Path("S:/")
    T = Path("T:/")
    U = Path("U:/")
    V = Path("V:/")
    W = Path("W:/")
    X = Path("X:/")
    Y = Path("Y:/")
    Z = Path("Z:/")

    def __init__(self, path: Path):
        self._value_ = path.resolve() if path.exists() else path