import sys

with open(r'c:\Users\Yousr\freegonya\web\src\app\page.tsx', 'rb') as f:
    content = f.read()
    # Look around the problematic area. 
    # Searching for "</section>"
    pos = content.find(b'</section>')
    while pos != -1:
        print(f"Match at {pos}:")
        start = max(0, pos - 50)
        end = min(len(content), pos + 150)
        chunk = content[start:end]
        print(chunk)
        pos = content.find(b'</section>', pos + 1)
