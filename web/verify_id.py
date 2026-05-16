import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

empty = re.findall(r', ""\)', content)
print(f"Empty id slots remaining: {len(empty)}")

checks = [
    "Jenius", "Negara", "Bahasa", "Mulai Petualangan",
    "Daftar Gratis", "Siap untuk membebaskan jenius",
    "Kursus & Latihan", "Pendekatan Kami", "Bebaskan Jenius"
]
for c in checks:
    found = c in content
    status = "OK" if found else "MISSING"
    print(f"  [{status}] {c}")

print("File is valid UTF-8: OK")
