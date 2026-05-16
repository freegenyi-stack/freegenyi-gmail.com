import os
import glob

# Search for known page.tsx content in turbopack cache
search_terms = [
    b"Lib\xc3\xa9rez le g\xc3\xa9nie",   # "Libérez le génie" in UTF-8
    b"liberer le genie",
    b"pont technologique",
    b"FreeGeny \xc3\xa9rige",             # "FreeGeny érige" in UTF-8
]

cache_dir = r".next\dev\cache\turbopack\ee6e79b1"
sst_files = glob.glob(os.path.join(cache_dir, "*.sst"))
sst_files += glob.glob(os.path.join(cache_dir, "*.meta"))

print(f"Searching {len(sst_files)} cache files...")
found_in = []

for sst_file in sorted(sst_files):
    try:
        with open(sst_file, "rb") as f:
            data = f.read()
        for term in search_terms:
            if term.lower() in data.lower():
                found_in.append((sst_file, term))
                print(f"FOUND '{term}' in {os.path.basename(sst_file)}")
                # Extract surrounding context
                idx = data.lower().find(term.lower())
                ctx = data[max(0,idx-50):idx+200]
                print(f"  Context: {ctx}")
                break
    except Exception as e:
        pass

if not found_in:
    print("Not found in cache. Looking for any French text...")
    for sst_file in sorted(sst_files)[:3]:
        with open(sst_file, "rb") as f:
            data = f.read()
        # Look for "pont technologique"  
        idx = data.find(b"pont technologique")
        if idx >= 0:
            print(f"Found 'pont technologique' in {os.path.basename(sst_file)}")
            ctx = data[max(0,idx-100):idx+300]
            print(f"Context bytes: {ctx[:200]}")
