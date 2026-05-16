import sys
import re

file_path = r'c:\Users\Yousr\freegonya\web\src\app\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Map of translations to add (17th argument)
translations = {
    'Transformation numérique complète.': 'पूर्ण डिजिटल परिवर्तन।',
    "En savoir plus →": "और जानें →",
    "Boost Émotionnel": "भावनात्मक प्रोत्साहन",
    "Vocal de maman enregistré": "माँ की रिकॉर्ड की गई आवाज़",
    "Félicitations Amine !": "बधाई हो अमीन!",
    "Innovation": "नवाचार",
    "Un pilotage d'exception.": "एक असाधारण संचालन।",
    "Motivez votre enfant avec votre propre voix.": "अपने बच्चे को अपनी आवाज़ से प्रेरित करें।",
    "Parcours IA Adaptatif": "अनुकूली एआई पथ",
    "Chaque clic réajuste le programme.": "हर क्लिक कार्यक्रम को पुनर्व्यवस्थित करता है।",
    "Prêt à libérer le génie ?": "क्या आप प्रतिभा को मुक्त करने के लिए तैयार हैं?",
    "S'inscrire gratuitement": "मुफ्त में साइन अप करें"
}

def fix_line(line):
    # Find t("...", "...", ..., "...") calls that have 16 arguments
    # We look for the closing paren of the t() call.
    # If it has 16 arguments, we add the 17th.
    
    # Simple heuristic: if it ends in ) and has 15 commas, it's 16 args.
    # But some strings might have commas.
    # Let's use a more robust regex to find the t() calls.
    
    matches = list(re.finditer(r't\((.*?)\)', line))
    if not matches:
        return line
        
    new_line = line
    offset = 0
    for match in matches:
        content = match.group(1)
        # Split by comma but respect quotes
        args = re.findall(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', content)
        if len(args) == 16:
            # Find the first arg to use as a key for translation
            first_arg = args[0].strip('"\'')
            hindi_trans = translations.get(first_arg, 'हिन्दी अनुवाद') # Fallback if not in map
            
            # Insert the new arg before the closing paren
            insertion_point = match.end(1) + offset
            new_arg = f', "{hindi_trans}"'
            new_line = new_line[:insertion_point] + new_arg + new_line[insertion_point:]
            offset += len(new_arg)
            
    return new_line

new_lines = [fix_line(l) for l in lines]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Translation arguments fixed.")
