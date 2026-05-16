import os
import re

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to find t(...) calls with exactly 35 arguments
    # This is a bit tricky with regex, so we'll look for strings ending with ) that don't have 36 args
    # But since we know we just need to add , "") at the end of every t() call that has 35
    
    # We can count commas inside t()
    # A simple way for these files:
    new_content = content
    
    # Let's use a more robust replacement for the specific t() calls in these files
    # Most of them end with ...)")
    
    # Find all t("...", ..., "...") calls
    pattern = r'(t\(".*?")\)'
    
    def repl(match):
        inner = match.group(1)
        commas = inner.count(',')
        if commas == 34: # 35 arguments = 34 commas
            return inner + ', "")'
        return match.group(0)

    # Actually, in these files, they are often multi-line
    # Let's just find t( and count until matching )
    
    result = []
    i = 0
    while i < len(content):
        if content[i:i+2] == 't(':
            # Find matching closing paren
            depth = 1
            j = i + 2
            while j < len(content) and depth > 0:
                if content[j] == '(': depth += 1
                elif content[j] == ')': depth -= 1
                j += 1
            
            call = content[i:j]
            commas = call.count(',')
            if commas == 34:
                result.append(call[:-1] + ', "")')
            else:
                result.append(call)
            i = j
        else:
            result.append(content[i])
            i += 1
            
    with open(path, 'w', encoding='utf-8') as f:
        f.write("".join(result))

fix_file('src/app/auth/login/page.tsx')
fix_file('src/app/auth/register/page.tsx')
print("Fixed t() calls in login and register pages.")
