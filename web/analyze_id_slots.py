import re

# Read with latin-1 to handle any encoding
with open("src/app/page.tsx", "r", encoding="latin-1") as f:
    content = f.read()

print(f"File size: {len(content)} chars")

# Find t() calls where last argument before closing ) is ""
# Pattern: ends with , "") or , "")
pattern = r',\s*""\)'
matches = list(re.finditer(pattern, content))
print(f"Found {len(matches)} t() calls ending with empty string")

# Show line numbers for each
lines = content.split('\n')
for m in matches:
    pos = m.start()
    line_num = content[:pos].count('\n') + 1
    line = lines[line_num-1].strip()[:100]
    print(f"  Line {line_num}: ...{line[-80:]}")
