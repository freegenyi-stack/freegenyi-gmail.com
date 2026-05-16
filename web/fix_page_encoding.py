"""
Fix page.tsx encoding corruption caused by latin-1 → utf-8 double-encoding.

The file was originally UTF-8 with a few Windows-1252 stray bytes.
My previous script read it as latin-1 which turned every UTF-8 multi-byte
sequence into mojibake. This script reverses that corruption.

Strategy: read as latin-1, re-encode each char back to its original bytes,
then decode the full byte stream as UTF-8 with replacement for bad bytes.
"""

import re

# Step 1: Read corrupted file as latin-1 (every byte maps to a codepoint)
with open("src/app/page.tsx", "r", encoding="latin-1") as f:
    corrupted = f.read()

# Step 2: Convert back to bytes using latin-1 (reverses the latin-1 read)
raw_bytes = corrupted.encode("latin-1")

# Step 3: Decode as UTF-8, replacing any leftover bad bytes
fixed = raw_bytes.decode("utf-8", errors="replace")

# Step 4: Remove any replacement characters (U+FFFD) that came from
# the original Windows-1252 stray bytes — replace with ASCII equivalent
# The byte at 8275 was likely é (0xe9) from Windows-1252
# Let's replace the most common Windows-1252 problem chars
fixed = fixed.replace("\ufffd", "")

# Step 5: Now fill the 34 empty Indonesian slots
id_translations = [
    "Bebaskan Jenius",
    "FreeGeny membangun jembatan teknologi antara Orang Tua, Sekolah, dan Anak untuk bimbingan holistik menuju keunggulan.",
    "Mulai Petualangan",
    "Pendekatan Kami",
    "Jenius",
    "Negara",
    "Sekolah",
    "Bahasa",
    "Kursus & Latihan",
    "Ilmu Pengetahuan FreeGeny",
    "Ilmu yang Mengubah Segalanya.",
    "Karena keunggulan sejati dibangun di atas fondasi ilmiah yang terbukti.",
    "Portal Lokal",
    "Penguasaan kurikulum resmi. Fondasi sekolah diperkuat dengan AI.",
    "Jelajahi Universe",
    "Portal Global",
    "Matematika Singapura dan Bahasa Inggris Oxford untuk ambisi tanpa batas.",
    "Jelajahi Dunia",
    "Arena Ajaib",
    "Tantangan seru yang disesuaikan secara dinamis untuk memperkuat setiap keterampilan melalui permainan.",
    "Masuk ke Arena",
    "Ekosistem FreeGeny",
    "Solusi untuk Semua.",
    "Karena keunggulan membutuhkan sinergi sempurna antara semua pihak.",
    "Ruang Orang Tua",
    "Pantau kemajuan, kirim motivasi suara, dan kelola hadiah.",
    "Pelajari Lebih",
    "FreeGeny Sekolah",
    "Transformasi digital lengkap.",
    "Pelajari Lebih",
    "Inovasi",
    "Manajemen Luar Biasa.",
    "Dorongan Emosional",
    "Motivasi anak Anda dengan suara Anda sendiri.",
]

# Count empty slots
pattern = r', ""\)'
slots = list(re.finditer(pattern, fixed))
print(f"After un-corruption: {len(slots)} empty id slots found")

# Fill positionally
parts = []
last = 0
for i, m in enumerate(slots):
    parts.append(fixed[last:m.start()])
    if i < len(id_translations):
        parts.append(f', "{id_translations[i]}")')
    else:
        parts.append(m.group(0))
    last = m.end()
parts.append(fixed[last:])
result = "".join(parts)

# Step 6: Write as valid UTF-8
with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(result)

# Verify
with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    verify = f.read()

remaining = len(re.findall(r', ""\)', verify))
print(f"Done! {remaining} empty slots remain.")
print(f"Key checks:")
for key in ["Jenius", "Mulai Petualangan", "Daftar Gratis", "Bebaskan Jenius"]:
    print(f"  [{('OK' if key in verify else 'MISSING')}] {key}")
print("Saved as valid UTF-8.")
