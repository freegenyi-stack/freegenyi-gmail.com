import os

def fix_syntax():
    path = 'src/app/page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix the missing opening quotes
    corrupted_patterns = [
        (', استكشف البوابات",', ', "استكشف البوابات",'),
        (', انغماس كامل.",', ', "انغماس كامل.",'),
        (', ثلاثة عوالم مترابطة لتقدم بلا حدود.",', ', "ثلاثة عوالم مترابطة لتقدم بلا حدود.",'),
        (', البوابة المحلية",', ', "البوابة المحلية",'),
        (', إتقان البرنامج الرسمي. أسسك الدراسية معززة بالذكاء الاصطناعي.",', ', "إتقان البرنامج الرسمي. أسسك الدراسية معززة بالذكاء الاصطناعي.",'),
        (', اكتشف العالم؟",', ', "اكتشف العالم؟",'),
        (', البوابة العالمية",', ', "البوابة العالمية",'),
        (', رياضيات سنغافورة وإنجليزي أكسفورد لطموح بلا حدود.",', ', "رياضيات سنغافورة وإنجليزي أكسفورد لطموح بلا حدود.",')
    ]
    
    new_content = content
    for old, new in corrupted_patterns:
        new_content = new_content.replace(old, new)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)

fix_syntax()
print("Fixed syntax errors in page.tsx.")
