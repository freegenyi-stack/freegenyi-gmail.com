import sys

file_path = r'c:\Users\Yousr\freegonya\web\src\app\page.tsx'

try:
    with open(file_path, 'rb') as f:
        content = f.read()
    
    # Try to decode with utf-8, ignoring errors, then encode back to utf-8
    decoded_content = content.decode('utf-8', errors='replace')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(decoded_content)
    
    print("File cleaned successfully.")
except Exception as e:
    print(f"Error: {e}")
