
import re

def split_text(text, chunk_size=500):
    sentences = re.split(r'(?<=[.!?]) +', text)
    chunks = []
    current = ''
    for sentence in sentences:
        if len((current + sentence).split()) < chunk_size:
            current += sentence + ' '
        else:
            chunks.append(current.strip())
            current = sentence + ' '
    if current:
        chunks.append(current.strip())
    return chunks
