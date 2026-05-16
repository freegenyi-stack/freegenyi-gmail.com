"""
True fix for double-encoding corruption.

Original: UTF-8 bytes like \xc3\xa9 (é)
After fill_id_translations.py (read latin-1, write UTF-8):
  \xc3 → Ã (U+00C3) → UTF-8: \xc3\x83
  \xa9 → © (U+00A9) → UTF-8: \xc2\xa9
  Result: \xc3\x83\xc2\xa9 (Ã© in the file instead of é)

Reversal:
  Read current file as UTF-8 → get string "Ã©"
  Encode as latin-1 → bytes \xc3\xa9
  Decode as UTF-8 → "é" ✓

This works for all multi-byte UTF-8 sequences (2-byte, 3-byte, 4-byte).
"""

import re

# Step 1: Read current (corrupted) file as UTF-8
with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    corrupted = f.read()

print(f"File length: {len(corrupted)} chars")

# Step 2: Encode as latin-1 to recover original bytes
# chars like Ã (U+00C3) → byte 0xC3, © (U+00A9) → byte 0xA9, etc.
raw_bytes = corrupted.encode("latin-1", errors="replace")
print(f"Raw bytes: {len(raw_bytes)} bytes")

# Step 3: Decode as UTF-8 — this gives back the original text
# The one originally-bad Windows-1252 byte becomes a replacement char
fixed = raw_bytes.decode("utf-8", errors="replace")

# Step 4: Clean up replacement chars (U+FFFD) — there should be very few
# These came from the one original bad byte
replacement_count = fixed.count("\ufffd")
print(f"Replacement chars to clean: {replacement_count}")
fixed = fixed.replace("\ufffd", "")

# Step 5: Verify Indonesian translations survived
checks = ["Jenius", "Negara", "Bahasa", "Mulai Petualangan", "Daftar Gratis",
          "Bebaskan Jenius", "Kursus & Latihan", "Pendekatan Kami"]
print("\nKey translation checks:")
for key in checks:
    status = "OK" if key in fixed else "MISSING"
    print(f"  [{status}] {key}")

# Step 6: Check for empty slots
empty_count = len(re.findall(r', ""\)', fixed))
print(f"\nEmpty id slots remaining: {empty_count}")

# Step 7: Write final valid UTF-8 file
with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(fixed)

print("Done! page.tsx restored to clean UTF-8.")
