import fitz  # PyMuPDF
import docx
import os
from PIL import Image
import pytesseract
import easyocr

# Carpeta donde se guardarán todas las imágenes extraídas
IMAGES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'storage', 'images'))
os.makedirs(IMAGES_DIR, exist_ok=True)
# Inicializa el OCR (EasyOCR puede manejar inglés y español)
reader = easyocr.Reader(['en', 'es'], gpu=False)

def extract_text_and_images(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    results = []
    if ext == '.pdf':
        doc = fitz.open(file_path)
        for page_num, page in enumerate(doc, 1):
            text = page.get_text()
            if text.strip():
                results.append({
                    "text": text,
                    "source": os.path.basename(file_path),
                    "page": page_num,
                    "is_image": False,
                    "image_path": False
                })
            for i, img_info in enumerate(page.get_images(full=True)):
                xref = img_info[0]
                img_data = doc.extract_image(xref)
                img_bytes = img_data['image']
                img_ext = img_data.get('ext', 'png')
                img_name = f"{os.path.splitext(os.path.basename(file_path))[0]}_p{page_num}_img{i}.{img_ext}"
                img_path = os.path.join(IMAGES_DIR, img_name)
                with open(img_path, 'wb') as f:
                    f.write(img_bytes)
                img = Image.open(img_path)
                # OCR con EasyOCR y Tesseract
                ocr_easy = " ".join([t[1] for t in reader.readtext(img_path)])
                ocr_tess = pytesseract.image_to_string(img, lang='eng+spa')
                ocr_text = (ocr_easy + "\n" + ocr_tess).strip()
                if ocr_text:
                    results.append({
                        "text": ocr_text,
                        "source": os.path.basename(file_path),
                        "page": page_num,
                        "is_image": True,
                        # SIEMPRE usa ruta relativa, así: 'images/archivopag_img.png'
                        "image_path": f"images/{img_name}"
                    })
    elif ext == '.docx':
        doc = docx.Document(file_path)
        full_text = [para.text for para in doc.paragraphs if para.text.strip()]
        if full_text:
            results.append({
                "text": "\n".join(full_text),
                "source": os.path.basename(file_path),
                "page": None,
                "is_image": False,
                "image_path": None
            })

    return results
