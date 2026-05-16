with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
# Show lines 250-260
for i, line in enumerate(lines[248:262], start=249):
    safe = repr(line[:150])
    print(f"L{i}: {safe}")
