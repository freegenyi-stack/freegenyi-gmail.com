content = open(r'c:\Users\Yousr\freegonya\web\src\app\page.tsx', 'r', encoding='utf-8').read()

def count_tags(tag_open, tag_close):
    opens = content.count(tag_open)
    closes = content.count(tag_close)
    print(f"{tag_open}: {opens}, {tag_close}: {closes}")

count_tags("<div", "</div>")
count_tags("<section", "</section>")
count_tags("<motion.div", "</motion.div>")
count_tags("<Link", "</Link>")
count_tags("<p", "</p>")
count_tags("<h1", "</h1>")
count_tags("<h2", "</h2>")
count_tags("<h3", "</h3>")
count_tags("<h4", "</h4>")
count_tags("<span", "</span>")
