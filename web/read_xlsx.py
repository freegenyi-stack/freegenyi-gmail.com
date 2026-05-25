import zipfile
import xml.etree.ElementTree as ET
import csv
import os

def export_sheet_to_csv(xlsx_path, csv_path, target_sheet='xl/worksheets/sheet3.xml'):
    with zipfile.ZipFile(xlsx_path, 'r') as z:
        # Get shared strings
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            with z.open('xl/sharedStrings.xml') as f:
                tree = ET.parse(f)
                root = tree.getroot()
                ns = {'ns': root.tag.split('}')[0].strip('{')} if '}' in root.tag else {}
                for si in root.findall('ns:si', ns) if ns else root.findall('si'):
                    text = "".join([t.text or "" for t in (si.findall('.//ns:t', ns) if ns else si.findall('.//t'))])
                    strings.append(text)
        
        # Open output CSV
        with open(csv_path, 'w', newline='', encoding='utf-8') as fout:
            writer = csv.writer(fout)
            
            with z.open(target_sheet) as f:
                tree = ET.parse(f)
                root = tree.getroot()
                ns = {'ns': root.tag.split('}')[0].strip('{')} if '}' in root.tag else {}
                
                for row in root.findall('.//ns:row', ns) if ns else root.findall('.//row'):
                    row_data = []
                    for c in row.findall('ns:c', ns) if ns else row.findall('c'):
                        v = c.find('ns:v', ns) if ns else c.find('v')
                        if v is not None:
                            val = v.text
                            if c.attrib.get('t') == 's': # string
                                val = strings[int(val)] if val else ""
                            row_data.append(val)
                        else:
                            row_data.append("")
                    
                    writer.writerow(row_data)

input_file = 'src/db/seeds/data/ecoles_primaires_irlande.xlsx'
output_file = 'src/db/seeds/data/ecoles_primaires_irlande.csv'
export_sheet_to_csv(input_file, output_file, 'xl/worksheets/sheet3.xml')
print(f"Exported to {output_file}")
