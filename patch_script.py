
import os

file_path = r'C:\Users\Luyanda\Desktop\MastercookeryPDF\script.js'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'if (logoBase64 && logoBase64 !==' in line:
        new_lines.append('        if (logoBase64 && logoBase64.length > 100) {\n')
    else:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Successfully patched script.js")
