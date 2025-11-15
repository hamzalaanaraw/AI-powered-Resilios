import os
import random
from typing import List

ASSET_DIR = os.path.join(os.path.dirname(__file__), "mascots")

def list_mascots() -> List[str]:
    """Return full list of mascot image file paths."""
    files = []
    for file in sorted(os.listdir(ASSET_DIR)):
        if file.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".svg")):
            files.append(os.path.join(ASSET_DIR, file))
    return files

def get_random_mascot() -> str:
    """Return a random mascot file path."""
    mascots = list_mascots()
    if not mascots:
        raise RuntimeError("No mascot assets found in 'mascots' directory")
    return random.choice(mascots)

def get_mascot_by_index(i: int) -> str:
    mascots = list_mascots()
    if not mascots:
        raise RuntimeError("No mascot assets found in 'mascots' directory")
    return mascots[i % len(mascots)]

if __name__ == "__main__":
    print("Mascots found:")
    for p in list_mascots():
        print(p)
