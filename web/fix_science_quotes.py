import os

def fix_science_quotes():
    path = 'src/app/page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Line 591 (0-indexed: 590)
    # Target: <span className="absolute -top-6 -left-4 text-6xl text-orange-500/20 font-serif leading-none select-none">?</span>
    # Correct: <span className={cn("absolute -top-6 -left-4 text-6xl text-orange-500/20 font-serif leading-none select-none", isRTL && "-right-4 -left-auto")}>{isRTL ? "\\u201d" : "\\u201c"}</span>
    
    lines[590] = '                <span className={cn("absolute -top-6 -left-4 text-6xl text-orange-500/20 font-serif leading-none select-none", isRTL && "-right-4 -left-auto")}>{isRTL ? "\\u201d" : "\\u201c"}</span>\n'
    
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Fixed science quote in page.tsx.")

fix_science_quotes()
