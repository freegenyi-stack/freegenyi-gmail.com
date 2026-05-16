import re

# Step 1: Read with latin-1 (reads ANY byte sequence without error)
with open("src/app/page.tsx", "rb") as f:
    raw = f.read()

# Step 2: Decode with latin-1 to get a clean Python string
content = raw.decode("latin-1")

# Step 3: Count empty id slots BEFORE filling
pattern = r',\s*""\)'
matches_before = list(re.finditer(pattern, content))
print(f"Found {len(matches_before)} empty id slots")

# Step 4: Indonesian translations in positional order
# Each entry corresponds to one empty "" at position 36 of a t() call
id_translations = [
    "Bebaskan Jenius",                          # hero title
    "FreeGeny membangun jembatan teknologi antara Orang Tua, Sekolah, dan Anak untuk bimbingan holistik menuju keunggulan.",
    "Mulai Petualangan",                        # start adventure
    "Pendekatan Kami",                          # our approach
    "Jenius",                                   # genius counter
    "Negara",                                   # countries
    "Sekolah",                                  # schools
    "Bahasa",                                   # languages
    "Kursus & Latihan",                         # courses
    "Ilmu Pengetahuan FreeGeny",                # science badge
    "Ilmu yang Mengubah Segalanya.",            # science title
    "Karena keunggulan sejati dibangun di atas fondasi ilmiah yang terbukti.",
    "Portal Lokal",                             # local portal title
    "Penguasaan kurikulum resmi. Fondasi sekolah diperkuat dengan AI.",
    "Jelajahi Universe",                        # local portal link
    "Portal Global",                            # world portal title
    "Matematika Singapura dan Bahasa Inggris Oxford untuk ambisi tanpa batas.",
    "Jelajahi Dunia",                           # world portal link
    "Arena Ajaib",                              # magic arena title
    "Tantangan seru yang disesuaikan secara dinamis untuk memperkuat setiap keterampilan melalui permainan.",
    "Masuk ke Arena",                           # magic arena link
    "Ekosistem FreeGeny",                       # ecosystem badge
    "Solusi untuk Semua.",                      # ecosystem title
    "Karena keunggulan membutuhkan sinergi sempurna antara semua pihak.",
    "Ruang Orang Tua",                          # parents space title
    "Pantau kemajuan, kirim motivasi suara, dan kelola hadiah.",
    "Pelajari Lebih",                           # parents link
    "FreeGeny Sekolah",                         # schools title
    "Transformasi digital lengkap.",            # schools desc
    "Pelajari Lebih",                           # schools link
    "Inovasi",                                  # innovation badge
    "Manajemen Luar Biasa.",                    # innovation title
    "Dorongan Emosional",                       # emotional boost title
    "Motivasi anak Anda dengan suara Anda sendiri.",
]

# Step 5: Replace each empty slot positionally
result = content
offset = 0
matches = list(re.finditer(pattern, result))

for i, m in enumerate(matches):
    if i >= len(id_translations):
        print(f"WARNING: no translation for slot {i+1}, leaving empty")
        break
    tr = id_translations[i]
    old = m.group(0)
    new = f', "{tr}")'
    # Recalculate position with offset
    start = m.start() + offset
    end = m.end() + offset
    result = result[:start] + new + result[end:]
    offset += len(new) - len(old)
    # Re-search for next match in updated string
    if i < len(matches) - 1:
        remaining = list(re.finditer(pattern, result[end + (len(new) - len(old)):]))
        # We need to keep searching on the full updated string
        matches = list(re.finditer(pattern, result))
        # Adjust: after replacement, re-find all matches and continue from i+1
        if i == 0:
            pass  # recalculated
        break  # restart loop with fresh matches

# Redo properly with a single pass
result = content
replacements = []
for m in re.finditer(pattern, content):
    replacements.append((m.start(), m.end(), m.group(0)))

new_result = []
last = 0
for i, (start, end, old) in enumerate(replacements):
    new_result.append(content[last:start])
    if i < len(id_translations):
        new_result.append(f', "{id_translations[i]}")')
    else:
        new_result.append(old)
    last = end
new_result.append(content[last:])
result = ''.join(new_result)

# Step 6: Write as UTF-8
with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(result)

# Verify
with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    verify = f.read()

remaining = len(re.findall(r',\s*""\)', verify))
print(f"Done! {len(replacements)} slots processed, {remaining} empty slots remaining.")
print("File saved as valid UTF-8.")
