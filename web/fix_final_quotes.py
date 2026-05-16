import os

def fix_final_quotes():
    path = 'src/app/page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Target lines 340 and 341 (0-indexed: 339 and 340)
    # We replace them with the complete span structure
    lines[339] = '                    <span className={cn("absolute -top-6 -left-6 text-[12rem] text-orange-700/80 font-serif leading-none select-none", isRTL && "-right-2 -left-auto")}>{isRTL ? "\\u201d" : "\\u201c"}</span>\n'
    lines[340] = '                    <span className={cn("absolute -bottom-16 -right-6 text-[12rem] text-orange-700/80 font-serif leading-none select-none", isRTL && "-left-2 -right-auto")}>{isRTL ? "\\u201c" : "\\u201d"}</span>\n'
    
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Surgically fixed decorative quotes in page.tsx.")

fix_final_quotes()
