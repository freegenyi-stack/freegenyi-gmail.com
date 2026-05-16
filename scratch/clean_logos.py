import os
from PIL import Image

def remove_gemini_logo(image_path):
    try:
        img = Image.open(image_path)
        width, height = img.size
        
        # Zone de nettoyage (300x100 pixels)
        l_width = 300
        l_height = 100
        
        # CIBLE : BAS DROITE
        # box = (left, top, right, bottom)
        box = (width - l_width, height - l_height, width, height)
        
        # On prend la texture juste au-dessus du logo à droite
        source_box = (width - l_width, height - (l_height * 2), width, height - l_height)
        texture_patch = img.crop(source_box)
        
        # On colle le patch
        img.paste(texture_patch, box)
        
        img.save(image_path)
        print(f"CLEANED (BOTTOM-RIGHT): {image_path}")
        
    except Exception as e:
        print(f"ERROR: {image_path} - {e}")

def process_all_regions(base_path):
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file == "hero.png":
                full_path = os.path.join(root, file)
                remove_gemini_logo(full_path)

if __name__ == "__main__":
    target_dir = r"C:\Users\Yousr\freegonya\web\public\assets\img\regions"
    process_all_regions(target_dir)
