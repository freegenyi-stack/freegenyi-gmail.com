path = 'src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# The broken lines to replace
old = (
    '                    )}>{isRTL ? \u201c : \u201c}</span>\n'
    '                    )}>{isRTL ? \u201d : \u201d}</span>'
)

# Try multiple possible encodings of the broken lines
broken_variants = [
    # variant 1
    '                    )}>{isRTL ? \u201c : \u201c}</span>\r\n                    )}>{isRTL ? \u201d : \u201d}</span>',
    # variant 2 - with HTML entities
    '                    )}>{isRTL ? \u201c : \u201c}</span>\r\n                    )}>{isRTL ? \u201d : \u201d}</span>',
]

fixed = (
    '                    <span className={cn("absolute -top-6 -left-6 text-[12rem] text-orange-700/80 font-serif leading-none select-none", isRTL && "-right-2 -left-auto")}>{isRTL ? \u201d\u201c\u201d : \u201c\u201c\u201c}</span>\r\n'
    '                    <span className={cn("absolute -bottom-16 -right-6 text-[12rem] text-orange-700/80 font-serif leading-none select-none", isRTL && "-left-2 -right-auto")}>{isRTL ? \u201c\u201c\u201c : \u201d\u201c\u201d}</span>'
)

# Print what's around line 340
lines = content.split('\n')
for i, line in enumerate(lines[336:346], start=337):
    print(f"{i}: {repr(line)}")
