import os
import fitz  # PyMuPDF
import docx

def detect_file_type(file_path):
    ext = os.path.splitext(file_path)[-1].lower()
    if ext == ".pdf":
        return "pdf"
    elif ext == ".docx":
        return "docx"
    else:
        raise ValueError(f"Unsupported file type: {ext}")

def extract_text_from_pdf(path):
    doc = fitz.open(path)
    return "\n".join([page.get_text() for page in doc])

def extract_text_from_docx(path):
    doc = docx.Document(path)
    return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])

def extract_text(path):
    ext = detect_file_type(path)
    if ext == "pdf":
        return extract_text_from_pdf(path)
    elif ext == "docx":
        return extract_text_from_docx(path)
