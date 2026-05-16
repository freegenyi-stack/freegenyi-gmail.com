import re

path = 'src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all t( calls where the second argument is missing its opening quote
# Pattern: t("...", ArabicText", rest)  -- where ArabicText starts without "
# We look for: , followed by an Arabic character (Unicode range 0600-06FF) directly
pattern = r',\s*([؀-ۿ][^"]*?)",'

def fix_missing_opening_quote(m):
    arab_text = m.group(1)
    return f', "{arab_text}",'

fixed = re.sub(pattern, fix_missing_opening_quote, content)

# Count changes
original_count = len(re.findall(pattern, content))
print(f"Fixed {original_count} missing opening quotes for Arabic strings.")

with open(path, 'w', encoding='utf-8') as f:
    f.write(fixed)

print("Done.")
