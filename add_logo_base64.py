import re

# Read the logo file and convert to Base64
with open('logo.png', 'rb') as f:
    logo_bytes = f.read()
    
import base64
logo_base64 = base64.b64encode(logo_bytes).decode('utf-8')

# Read the current script.js
with open('script.js', 'r', encoding='utf-8') as f:
    script_content = f.read()

# Add the LOGO_BASE64 constant after STORAGE_KEY
logo_constant = f"\n// === LOGO BASE64 ===\nconst LOGO_BASE64 = '{logo_base64}';\n"

# Find the position to insert (after STORAGE_KEY line)
pattern = r"(const STORAGE_KEY = 'master_cookery_data';)"
replacement = r"\1" + logo_constant

script_content = re.sub(pattern, replacement, script_content)

# Now update the PDF generation to use the Base64 logo
# Find the logo embedding section and replace it
old_logo_code = r"""        // === EMBED LOGO ===
        let logoEmbedded = false;
        try {
            console.log\('🔄 Attempting to load logo...'\);
            const logoResponse = await fetch\('logo.png'\);
            
            if \(!logoResponse.ok\) {
                throw new Error\(`Logo fetch failed: \${logoResponse.status}`\);
            }
            
            const logoArrayBuffer = await logoResponse.arrayBuffer\(\);
            console.log\('✅ Logo loaded, size:', logoArrayBuffer.byteLength, 'bytes'\);
            
            const logoImage = await pdfDoc.embedPng\(logoArrayBuffer\);
            const logoDims = logoImage.scale\(0.18\);
            
            page.drawImage\(logoImage, {
                x: 40,
                y: height - headerHeight \+ 10,
                width: logoDims.width,
                height: logoDims.height,
            }\);
            logoEmbedded = true;
            console.log\('✅ Logo embedded successfully in PDF'\);
        } catch \(error\) {
            console.error\('❌ Logo embedding failed:', error\);
            console.error\('Make sure logo.png exists in the same directory as index.html'\);
        }"""

new_logo_code = """        // === EMBED LOGO FROM BASE64 ===
        let logoEmbedded = false;
        try {
            const logoBytes = Uint8Array.from(atob(LOGO_BASE64), c => c.charCodeAt(0));
            const logoImage = await pdfDoc.embedPng(logoBytes);
            const logoDims = logoImage.scale(0.18);
            
            page.drawImage(logoImage, {
                x: 40,
                y: height - headerHeight + 10,
                width: logoDims.width,
                height: logoDims.height,
            });
            logoEmbedded = true;
            console.log('✅ Logo embedded successfully');
        } catch (error) {
            console.error('❌ Logo embedding failed:', error);
        }"""

script_content = re.sub(old_logo_code, new_logo_code, script_content, flags=re.DOTALL)

# Write the updated script
with open('script.js', 'w', encoding='utf-8') as f:
    f.write(script_content)

print("✅ Logo Base64 added to script.js successfully!")
