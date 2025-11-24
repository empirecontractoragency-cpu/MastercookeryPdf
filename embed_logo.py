import os

# Read the base64 string
try:
    with open('logo_base64.txt', 'r') as f:
        logo_base64 = f.read().strip()
    print(f"Read logo_base64.txt, length: {len(logo_base64)}")
except Exception as e:
    print(f"Error reading logo_base64.txt: {e}")
    exit(1)

# Read script.js
try:
    with open('script.js', 'r') as f:
        script_content = f.read()
    print(f"Read script.js, length: {len(script_content)}")
except Exception as e:
    print(f"Error reading script.js: {e}")
    exit(1)

# Check for placeholder
if '"LOGOPLACEHOLDER"' in script_content:
    print("Found placeholder")
else:
    print("Placeholder NOT found")

# Replace the placeholder
new_content = script_content.replace('"LOGOPLACEHOLDER"', f'"data:image/png;base64,{logo_base64}"')

# Write back to script.js
try:
    with open('script.js', 'w') as f:
        f.write(new_content)
    print("Successfully wrote to script.js")
except Exception as e:
    print(f"Error writing to script.js: {e}")
    exit(1)
