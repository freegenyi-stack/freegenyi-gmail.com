with open(r'c:\Users\Yousr\freegonya\web\src\app\page.tsx', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if len(line) > 200:
            print(f"Line {i+1} is very long: {len(line)} chars")
            print(f"Start: {line[:50]}")
            print(f"End: {line[-50:]}")
            # print hex of the first 100 chars to see if there are weird ones
            print(line.encode('utf-8').hex()[:100])
