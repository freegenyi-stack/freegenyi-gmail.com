# -*- coding: utf-8 -*-
import sys
import PyPDF2
from docx import Document

# Set UTF-8 encoding for console output
sys.stdout.reconfigure(encoding='utf-8')

print("="*80)
print("CONTENU DU FICHIER WORD - Mathématiques.docx")
print("="*80)

doc = Document(r'c:\Users\Yousr\freegonya\programs\ar\algeria\1AP\Mathématiques.docx')
for p in doc.paragraphs:
    if p.text.strip():
        print(p.text)

print("\n" + "="*80)
print("CONTENU DU FICHIER PDF - Programme_Officiel.pdf")
print("="*80)

with open(r'c:\Users\Yousr\freegonya\programs\ar\algeria\1AP\Programme_Officiel.pdf', 'rb') as pdf_file:
    reader = PyPDF2.PdfReader(pdf_file)
    for i, page in enumerate(reader.pages):
        print(f"\n--- Page {i+1} ---")
        print(page.extract_text())
